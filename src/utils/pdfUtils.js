import jsPDF from 'jspdf';
import { subHours, subMinutes, subDays, subWeeks } from 'date-fns'; // Keep for time estimation
import { formatInTimeZone } from 'date-fns-tz'; // Keep for GMT formatting

// --- Configuration ---
const PAGE_WIDTH_MM = 210; // A4 width
const PAGE_HEIGHT_MM = 297; // A4 height
const MARGIN_MM = 15;
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2;

// --- Styling Constants ---
const LOGO_HEIGHT_MM = 10;
const TITLE_FONT_SIZE = 18;
const META_FONT_SIZE = 9;
const SUMMARY_FONT_SIZE = 11;
const BODY_FONT_SIZE = 10; // Body font size for jsPDF text
const SOURCE_FONT_SIZE = 8;
const LINE_HEIGHT_NORMAL = 1.4;
const LINE_HEIGHT_TITLE = 1.2;
const SPACE_AFTER_LOGO_MM = 8;
const SPACE_AFTER_TITLE_MM = 3;
const SPACE_AFTER_META_MM = 6;
const SPACE_AFTER_SUMMARY_MM = 6;
const SPACE_AFTER_IMAGE_MM = 8;
const SPACE_AFTER_BODY_MM = 10;
const SPACE_AFTER_VIDEO_MM = 4;
const SPACE_BETWEEN_ELEMENTS_MM = 5; // General small gap

// --- Helper: Load Image ---
const loadImage = (src) => {
    return new Promise((resolve) => { // Simplified promise
        if (!src) {
            console.warn("loadImage called with null or undefined src.");
            resolve(null);
            return;
        }
        console.log(`Attempting to load image: ${src}`);
        const img = new Image();
        img.onload = () => { console.log(`Loaded image: ${src} (${img.width}x${img.height})`); resolve(img); };
        img.onerror = (err) => { console.error(`Failed to load image: ${src}`, err); resolve(null); }; // Resolve null on error
        // Allow cross-origin for external article images
        if (!src.startsWith('/') && !src.startsWith('data:')) { img.crossOrigin = 'anonymous'; }
        img.src = src;
    });
};

// --- Helper: Add text with page break check and alignment ---
const addTextWithWrap = (doc, text, x, yPos, maxWidth, options = {}) => {
    const { fontSize = 10, fontStyle = 'normal', lineHeight = LINE_HEIGHT_NORMAL, color = [0, 0, 0], align = 'left' } = options;
    const textString = String(text ?? '').trim(); // Trim whitespace
    if (!textString) { return yPos; } // Don't add empty strings

    try {
        doc.setFont('helvetica', fontStyle); 
        doc.setFontSize(fontSize); 
        doc.setTextColor(color[0], color[1], color[2]);
        
        // Split text into lines that fit within maxWidth
        const lines = doc.splitTextToSize(textString, maxWidth);
        
        // Process lines in chunks to handle page breaks
        let currentLine = 0;
        while (currentLine < lines.length) {
            // Calculate how many lines we can fit on current page
            const lineHeight_mm = fontSize * 0.352777 * lineHeight;
            const remainingHeight = PAGE_HEIGHT_MM - MARGIN_MM - yPos.y;
            const maxLinesOnPage = Math.floor(remainingHeight / lineHeight_mm);
            
            // If no lines fit on current page, add a new page
            if (maxLinesOnPage <= 0) {
                console.log(`Adding page break during text: "${textString.substring(0,20)}..."`);
                doc.addPage();
                yPos.y = MARGIN_MM; // Reset Y position for new page
                continue; // Recalculate with new page
            }
            
            // Get the chunk of lines that fit on this page
            const linesToAdd = lines.slice(currentLine, currentLine + maxLinesOnPage);
            
            // Add these lines to the document
            doc.text(linesToAdd, align === 'center' ? PAGE_WIDTH_MM / 2 : x, yPos.y, { align: align });
            
            // Update position and line counter
            const addedHeight = linesToAdd.length * lineHeight_mm;
            yPos.y += addedHeight;
            currentLine += linesToAdd.length;
            
            // If we have more lines but no space on current page, add a new page
            if (currentLine < lines.length) {
                console.log(`Adding page break after text chunk: "${textString.substring(0,20)}..."`);
                doc.addPage();
                yPos.y = MARGIN_MM; // Reset Y position for new page
            }
        }
        
        return yPos;
    } catch (textError) {
        console.error("Error adding text to PDF:", textError, { text: textString });
        throw textError; // Re-throw error to be caught by main try-catch
    }
};

// --- Helper: Strip HTML Tags (Basic) ---
const stripHtml = (html) => {
     if (!html) return '';
     try {
         let tempDiv = document.createElement('div');
         tempDiv.innerHTML = html
            .replace(/<\/p>/gi, '\n\n') // Replace closing paragraph with double newline
            .replace(/<br\s*\/?>/gi, '\n'); // Replace breaks with newline
         let decodedText = tempDiv.textContent || tempDiv.innerText || "";
         // Collapse multiple spaces/newlines but preserve paragraph breaks
         return decodedText.replace(/[ \t]+/g, ' ').replace(/(\n\s*){3,}/g, '\n\n').trim();
     } catch (stripError) {
         console.error("Error stripping HTML:", stripError);
         return html; // Return original HTML on error
     }
}

// --- Helper: Estimate Date from Relative String ---
const estimateDateFromRelative = (relativeTime) => {
    if (typeof relativeTime !== 'string') return null;
    const now = new Date();
    const lowerTime = relativeTime.toLowerCase();
    if (lowerTime === 'just updated' || lowerTime === 'now') return now;
    const match = lowerTime.match(/^(\d+)\s+(min|minute|hr|hour|day|wk|week)s? ago$/);
    if (match) {
        const value = parseInt(match[1], 10); const unit = match[2];
        if (!isNaN(value)) {
            if (unit.startsWith('min')) return subMinutes(now, value);
            if (unit.startsWith('hr') || unit.startsWith('hour')) return subHours(now, value);
            if (unit.startsWith('day')) return subDays(now, value);
            if (unit.startsWith('wk') || unit.startsWith('week')) return subWeeks(now, value);
        }
    }
    console.warn(`Could not parse relative time string: "${relativeTime}"`);
    return null;
};

// --- Helper: Check if content fits on page and add new page if needed ---
const checkPageBreak = (doc, yPos, heightNeeded) => {
    if (yPos.y + heightNeeded > PAGE_HEIGHT_MM - MARGIN_MM) {
        console.log(`Adding page break. Current Y: ${yPos.y.toFixed(1)}, Height needed: ${heightNeeded.toFixed(1)}`);
        doc.addPage();
        yPos.y = MARGIN_MM;
        return true;
    }
    return false;
};

// --- Main PDF Generation Function ---
export const generatePdf = async (article) => {
    if (!article) { console.error("generatePdf: article data is missing."); alert("Cannot generate PDF: Article data missing."); return; }
    console.log("generatePdf started for article:", article.id);

    const doc = new jsPDF('p', 'mm', 'a4');
    let yPos = { y: MARGIN_MM }; // Use object to pass Y by reference

    try { // Wrap the entire generation process
        console.log("Step 1: Adding Logo...");
        // 1. Add Logo (Centered)
        const logoPath = '/images/bbc-logo-light-mode.png'; // Ensure this path is correct in /public
        const logoImg = await loadImage(logoPath);
        checkPageBreak(doc, yPos, LOGO_HEIGHT_MM + SPACE_AFTER_LOGO_MM);
        
        if (logoImg && logoImg.height > 0) { // Check height > 0
             try {
                const logoWidth = (LOGO_HEIGHT_MM / logoImg.height) * logoImg.width;
                const logoX = (PAGE_WIDTH_MM - logoWidth) / 2;
                const logoType = logoPath.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG'; // Basic type check
                doc.addImage(logoImg, logoType, logoX, yPos.y, logoWidth, LOGO_HEIGHT_MM);
                yPos.y += LOGO_HEIGHT_MM; // Add height first
             } catch (logoAddError) {
                 console.error("Error adding logo image to PDF:", logoAddError);
                 addTextWithWrap(doc, "BBC News", MARGIN_MM, yPos, CONTENT_WIDTH_MM, { fontSize: META_FONT_SIZE, align: 'center' }); // Fallback
             }
        } else {
             console.warn("Logo image object invalid or failed to load. Using fallback text.", logoImg);
             addTextWithWrap(doc, "BBC News", MARGIN_MM, yPos, CONTENT_WIDTH_MM, { fontSize: META_FONT_SIZE, align: 'center' });
        }
        yPos.y += SPACE_AFTER_LOGO_MM; // Add space AFTER logo/fallback
        console.log("Step 1 Done. Y:", yPos.y.toFixed(1));

        // 2. Add Title (Centered)
        console.log("Step 2: Adding Title...");
        // Calculate title height before adding
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(TITLE_FONT_SIZE);
        const titleLines = doc.splitTextToSize(article.headline || 'Untitled Article', CONTENT_WIDTH_MM);
        const titleHeight = titleLines.length * TITLE_FONT_SIZE * 0.352777 * LINE_HEIGHT_TITLE;
        
        checkPageBreak(doc, yPos, titleHeight + SPACE_AFTER_TITLE_MM);
        addTextWithWrap(doc, article.headline || 'Untitled Article', MARGIN_MM, yPos, CONTENT_WIDTH_MM, 
            { fontSize: TITLE_FONT_SIZE, fontStyle: 'bold', lineHeight: LINE_HEIGHT_TITLE, align: 'center' });
        yPos.y += SPACE_AFTER_TITLE_MM;
        console.log("Step 2 Done. Y:", yPos.y.toFixed(1));

        // 3. Add Category/Timestamp Meta Line (Centered)
        console.log("Step 3: Adding Meta...");
        let metaText = '';
        if (article.publishedAt) {
            const estimatedDate = estimateDateFromRelative(article.publishedAt);
            if (estimatedDate) {
                try { metaText += formatInTimeZone(estimatedDate, 'UTC', "d MMM yyyy, HH:mm 'GMT'"); }
                catch (formatError) { console.error("Error formatting date:", formatError); metaText += article.publishedAt; }
            } else { metaText += article.publishedAt; }
        } else { console.log("No publishedAt found for meta."); }
        if (article.category) metaText += (metaText ? ' | ' : '') + article.category;
        
        if (metaText) { 
            // Calculate meta height before adding
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(META_FONT_SIZE);
            const metaLines = doc.splitTextToSize(metaText, CONTENT_WIDTH_MM);
            const metaHeight = metaLines.length * META_FONT_SIZE * 0.352777 * LINE_HEIGHT_NORMAL;
            
            checkPageBreak(doc, yPos, metaHeight + SPACE_AFTER_META_MM);
            addTextWithWrap(doc, metaText, MARGIN_MM, yPos, CONTENT_WIDTH_MM, 
                { fontSize: META_FONT_SIZE, color: [100, 100, 100], align: 'center' }); 
        } else { 
            console.log("No meta text to add."); 
        }
        yPos.y += SPACE_AFTER_META_MM;
        console.log("Step 3 Done. Y:", yPos.y.toFixed(1));

        // 4. Add Summary Text (Left Aligned)
        console.log("Step 4: Adding Summary...");
        if(article.summary){ 
            // Calculate summary height before adding
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(SUMMARY_FONT_SIZE);
            const summaryLines = doc.splitTextToSize(article.summary, CONTENT_WIDTH_MM);
            const summaryHeight = summaryLines.length * SUMMARY_FONT_SIZE * 0.352777 * LINE_HEIGHT_NORMAL;
            
            checkPageBreak(doc, yPos, summaryHeight + SPACE_AFTER_SUMMARY_MM);
            addTextWithWrap(doc, article.summary, MARGIN_MM, yPos, CONTENT_WIDTH_MM, 
                { fontSize: SUMMARY_FONT_SIZE, color: [50, 50, 50] }); 
            yPos.y += SPACE_AFTER_SUMMARY_MM; 
        } else { 
            console.log("No summary found."); 
        }
        console.log("Step 4 Done. Y:", yPos.y.toFixed(1));

        // 5. Add Main Article Image
        console.log("Step 5: Processing Article Image...");
        let imageAdded = false; 
        let imageAttempted = false; 
        let imgHeight = 0; // Initialize imgHeight
        
        if (article.imageUrl && !article.imageUrl.endsWith('placeholder.png')) {
            imageAttempted = true;
            console.log("Attempting to load article image:", article.imageUrl);
            const articleImg = await loadImage(article.imageUrl);
            
            if (articleImg && articleImg.height > 0 && articleImg.width > 0) {
                console.log("Article image loaded, calculating dimensions...");
                const aspectRatio = articleImg.width / articleImg.height;
                let imgWidth = CONTENT_WIDTH_MM; 
                imgHeight = imgWidth / aspectRatio; // Assign calculated height
                const maxHeight = PAGE_HEIGHT_MM / 2.5;
                
                if (imgHeight > maxHeight) { 
                    imgHeight = maxHeight; 
                    imgWidth = imgHeight * aspectRatio; 
                }
                
                const imgX = MARGIN_MM + (CONTENT_WIDTH_MM - imgWidth) / 2;
                console.log(`Image dimensions for PDF: ${imgWidth.toFixed(1)}x${imgHeight.toFixed(1)}mm at Y=${yPos.y.toFixed(1)}`);

                // Check if image fits on current page
                checkPageBreak(doc, yPos, imgHeight + SPACE_AFTER_IMAGE_MM);
                
                const imageType = article.imageUrl.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
                try {
                     console.log("Attempting doc.addImage for article image...");
                     doc.addImage(articleImg, imageType, imgX, yPos.y, imgWidth, imgHeight);
                     yPos.y += imgHeight; 
                     imageAdded = true; // Add height AFTER successful add
                     console.log("Article image added successfully.");
                 } catch(imgAddError){
                     console.error("jsPDF failed to add article image:", imgAddError);
                     addTextWithWrap(doc, "[Image could not be added to PDF]", MARGIN_MM, yPos, CONTENT_WIDTH_MM, 
                        {fontSize: META_FONT_SIZE, color: [150,0,0]});
                 }
            } else {
                 console.warn("Article image was invalid or failed to load from:", article.imageUrl);
                 addTextWithWrap(doc, "[Image unavailable]", MARGIN_MM, yPos, CONTENT_WIDTH_MM, 
                    {fontSize: META_FONT_SIZE, color: [150,0,0]});
            }
        } else { 
            console.log("No valid article image URL provided."); 
        }
        
        if (imageAttempted) { 
            yPos.y += SPACE_AFTER_IMAGE_MM; 
        } // Add space only if image was processed
        
        console.log("Step 5 Done. Y:", yPos.y.toFixed(1));

        // 6. Add Body Content as PLAIN TEXT
        console.log("Step 6: Adding Body Text...");
        const bodyText = stripHtml(article.fullContent || '');
        
        if (bodyText) {
            // No need to calculate height in advance as our improved addTextWithWrap
            // will handle page breaks automatically for long text
            addTextWithWrap(doc, bodyText, MARGIN_MM, yPos, CONTENT_WIDTH_MM, {
                fontSize: BODY_FONT_SIZE, lineHeight: LINE_HEIGHT_NORMAL
            });
            console.log("Body text added.");
        } else { 
            console.log("No body text found."); 
        }
        
        let finalYAfterBody = yPos.y; // Use yPos directly as addTextWithWrap modifies it
        console.log("Step 6 Done. Y:", finalYAfterBody.toFixed(1));

        // 7. Add Video URL and Source Link
        console.log("Step 7: Adding Links...");
        // Calculate total height needed for links
        let linksHeight = 0;
        if (article.videoUrl) {
            linksHeight += (1 * SOURCE_FONT_SIZE * 0.352777 * LINE_HEIGHT_NORMAL) + SPACE_AFTER_VIDEO_MM;
        }
        linksHeight += (1 * SOURCE_FONT_SIZE * 0.352777 * LINE_HEIGHT_NORMAL) + SPACE_BETWEEN_ELEMENTS_MM;
        
        // Add space before links only if content was added
        if (bodyText || imageAdded) { 
            checkPageBreak(doc, yPos, SPACE_AFTER_BODY_MM + linksHeight);
            yPos.y += SPACE_AFTER_BODY_MM; 
        } else {
            checkPageBreak(doc, yPos, linksHeight);
        }

        if (article.videoUrl) { 
            addTextWithWrap(doc, `Video URL: ${article.videoUrl}`, MARGIN_MM, yPos, CONTENT_WIDTH_MM, 
                { fontSize: SOURCE_FONT_SIZE, color: [80, 80, 80], fontStyle: 'italic'});
            yPos.y += SPACE_AFTER_VIDEO_MM; 
        }
        
        const sourceUrl = window.location.origin + `/article/${article.id}`;
        addTextWithWrap(doc, `Source: ${sourceUrl}`, MARGIN_MM, yPos, CONTENT_WIDTH_MM, 
            { fontSize: SOURCE_FONT_SIZE, color: [80, 80, 80], fontStyle: 'italic'});
        
        console.log("Step 7 Done. Final Y:", yPos.y.toFixed(1));

        // 8. Save PDF
        console.log("Step 8: Saving PDF...");
        const filename = (article.headline || 'bbc-article').toLowerCase()
            .replace(/[^\w\s-]/gi, '')
            .replace(/\s+/g, '-')
            .substring(0, 50) + '.pdf';
        
        doc.save(filename);
        console.log("PDF Saved:", filename);

    } catch (error) {
        console.error("Critical Error during PDF generation:", error);
        alert("Sorry, there was a critical error generating the PDF. Check console for details.");
    }
};