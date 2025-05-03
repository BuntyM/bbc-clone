import { subHours, subMinutes, subDays, subWeeks } from 'date-fns';

// --- Initial Counts ---
const initialViewCounts = {
    'gaza-activists-ship-drones': 187, 'trump-trudeau-carney': 305,
    'harry-legal-challenge-security': 512, 'afd-germany-intelligence': 215,
    'chile-tsunami-warning': 488, 'jill-sobule-house-fire': 95,
    'russell-brand-bail': 350,
};
const initialDownloadCounts = {
    'gaza-activists-ship-drones': 12, 'trump-trudeau-carney': 25,
    'harry-legal-challenge-security': 41, 'afd-germany-intelligence': 8,
    'chile-tsunami-warning': 33, 'jill-sobule-house-fire': 5,
    'russell-brand-bail': 19,
};

// Helper to estimate ISO string
const estimateISOString = (relativeTime) => {
    const now = new Date(); if (typeof relativeTime !== 'string') return now.toISOString();
    const lowerTime = relativeTime.toLowerCase(); if (lowerTime === 'just updated' || lowerTime === 'now') return now.toISOString();
    const match = lowerTime.match(/^(\d+)\s+(min|minute|hr|hour|day|wk|week)s? ago$/);
    if (match) { const value = parseInt(match[1], 10); const unit = match[2];
        if (!isNaN(value)) { if (unit.startsWith('min')) return subMinutes(now, value).toISOString(); if (unit.startsWith('hr') || unit.startsWith('hour')) return subHours(now, value).toISOString(); if (unit.startsWith('day')) return subDays(now, value).toISOString(); if (unit.startsWith('wk') || unit.startsWith('week')) return subWeeks(now, value * 7).toISOString(); } }
    try { const parsedDate = new Date(relativeTime); if (!isNaN(parsedDate)) return parsedDate.toISOString(); } catch(e) {}
    return now.toISOString();
};


export const mockArticles = [
    {
        id: "gaza-activists-ship-drones",
        headline: "Activists say ship aiming to sail to Gaza was attacked by drones",
        summary: "The incident happened off the coast of Malta. The government said a fire onboard the ship was \"brought under control overnight\".",
        category: "Middle East",
        section: "Middle East",
        imageUrl: "https://ichef.bbci.co.uk/news/480/cpsprodpb/9ae7/live/5a303410-2754-11f0-b745-ddd00b76d3a8.jpg.webp",
        publishedAt: "2 hrs ago",
        layout: "homepage-left",
        publishedISO: estimateISOString("2 hrs ago"),
        fullContent: "<p>Activists who were planning to sail a ship to Gaza say it was struck by drones in international waters off the coast of Malta - appearing to accuse Israel of being behind the attack.</p><p>The Freedom Flotilla Coalition said its ship The Conscience was targeted at 00:23 local time on Friday and issued an SOS signal right after the attack.</p><p>The BBC was sent a recording of the distress call from the flotilla ship, recorded by a crew member on a nearby oil tanker. The captain of the flotilla ship can clearly be heard reporting drone strikes and a fire onboard.</p><p>The Maltese government said everyone aboard the ship was \"confirmed safe\" and that a fire onboard the ship was \"brought under control overnight\".</p><p>The Freedom Flotilla Coalition said it had planned to sail to Gaza with people including climate activist Greta Thunberg on board and \"challenge Israel's illegal siege and blockade\".</p><p>The NGO called for Israeli ambassadors to be summoned to answer for \"violation of international law, including the ongoing blockade and the bombing of our civilian vessel\".</p><p>The Israeli military said it was looking into reports of the attack.</p><p>Organisers told the BBC that the group had been \"operating in total secrecy with a complete media blackout\" to prevent \"sabotage\" as they prepared to sail towards Gaza - where about two million Palestinians have been under a complete blockade by the Israeli military for two months.</p><p>Volunteer Surya McEwen said he and others had lost contact with the ship after the incident, which he said caused a fire on board and damaged the hull. They had since been told there were no major injuries.</p><p>\"It's a full-on situation for them but they're recovering,\" he told the BBC, adding that the incident had been an \"unprovoked attack on a civilian vessel in international waters, trying to do a humanitarian mission\".</p><p>Climate activist Greta Thunberg was among those who had planned to board the ship once it departed for Gaza on Friday.</p><p>Speaking to journalists in Valetta, she said: \"I was part of the group who was supposed to board that boat today to continue the voyage towards Gaza, which is one of many attempts to open up a humanitarian corridor and to do our part to keep trying to break Israel's illegal siege on Gaza.\"</p><p>Thunberg added that as far as she's aware, the ship is still at the location of the attack because moving it would let too much water in.</p><p>\"What is certain is that we human rights activists will continue to do everything in our power to do our part, to demand a free Palestine and demand the opening of a humanitarian corridor,\" she said.</p><p>The Maltese government said that 12 crew and four activists were on board the boat, while the NGO said 30 activists had been on board.</p><p>The Freedom Flotilla Coalition uploaded a video showing a fire on the ship. It said the attack appeared to have targeted the generator, which left the ship without power and at risk of sinking.</p><p>Reuters irefighters try to extinguish a fire onboard the Gaza Freedom Flotilla vessel ConscienceReuters Firefighters try to extinguish the blaze on board the Conscience The Maltese government said a tugboat was sent to the scene to extinguish the fire, which they say was under control by 01:28 local time.</p><p>\"By 2:13, all crew were confirmed safe but refused to board the tug,\" the statement said, adding the ship remains outside territorial waters.</p><p>Cyprus responded to the SOS signal by dispatching a vessel, the activists said, but that it did not \"provide the critical electrical support needed\".</p><p>Marine tracking software shows that the Conscience left Tunisia on Tuesday evening and is currently around 12-14 nautical miles off Malta.</p><p>The coalition is campaigning to end Israel's blockade of Gaza, which is also facing mounting international condemnation. Last month the UK, French and German foreign ministers described the Israeli decision to block aid as \"intolerable\".</p><p>Gaza kitchens warn food will run out in days after two months of Israeli blockade Two months ago, Israel shut all crossings to Gaza – preventing all goods, including food, fuel and medicines from entering - and later resumed its military offensive, ending a two-month ceasefire with Hamas.</p><p>Some humanitarian organisations such as the World Food Programme say they have already run out of food while community kitchens say their stocks are dwindling fast. On Friday the Red Cross said the humanitarian response in Gaza was on the verge of \"total collapse\".</p><p>The Israeli military launched a campaign to destroy Hamas in response to an unprecedented cross-border attack on 7 October 2023, in which about 1,200 people were killed and 251 others were taken hostage.</p><p>At least 52,418 people have been killed in Gaza during the ensuing war, according to the territory's Hamas-run health ministry.</p><p>Additional reporting by Tom Bateman, Alice Cuddy and BBC Verify</p><p>Activists who were planning to sail a ship to Gaza say it was struck by drones in international waters off the coast of Malta - appearing to accuse Israel of being behind the attack.</p><p>The Freedom Flotilla Coalition said its ship The Conscience was targeted at 00:23 local time on Friday and issued an SOS signal right after the attack.</p><p>The BBC was sent a recording of the distress call from the flotilla ship, recorded by a crew member on a nearby oil tanker. The captain of the flotilla ship can clearly be heard reporting drone strikes and a fire onboard.</p><p>The Maltese government said everyone aboard the ship was \"confirmed safe\" and that a fire onboard the ship was \"brought under control overnight\".</p><p>The Freedom Flotilla Coalition said it had planned to sail to Gaza with people including climate activist Greta Thunberg on board and \"challenge Israel's illegal siege and blockade\".</p><p>The NGO called for Israeli ambassadors to be summoned to answer for \"violation of international law, including the ongoing blockade and the bombing of our civilian vessel\".</p><p>The Israeli military said it was looking into reports of the attack.</p><p>Organisers told the BBC that the group had been \"operating in total secrecy with a complete media blackout\" to prevent \"sabotage\" as they prepared to sail towards Gaza - where about two million Palestinians have been under a complete blockade by the Israeli military for two months.</p><p>Volunteer Surya McEwen said he and others had lost contact with the ship after the incident, which he said caused a fire on board and damaged the hull. They had since been told there were no major injuries.</p><p>\"It's a full-on situation for them but they're recovering,\" he told the BBC, adding that the incident had been an \"unprovoked attack on a civilian vessel in international waters, trying to do a humanitarian mission\".</p><p>Climate activist Greta Thunberg was among those who had planned to board the ship once it departed for Gaza on Friday.</p><p>Speaking to journalists in Valetta, she said: \"I was part of the group who was supposed to board that boat today to continue the voyage towards Gaza, which is one of many attempts to open up a humanitarian corridor and to do our part to keep trying to break Israel's illegal siege on Gaza.\"</p><p>Thunberg added that as far as she's aware, the ship is still at the location of the attack because moving it would let too much water in.</p><p>\"What is certain is that we human rights activists will continue to do everything in our power to do our part, to demand a free Palestine and demand the opening of a humanitarian corridor,\" she said.</p><p>The Maltese government said that 12 crew and four activists were on board the boat, while the NGO said 30 activists had been on board.</p><p>The Freedom Flotilla Coalition uploaded a video showing a fire on the ship. It said the attack appeared to have targeted the generator, which left the ship without power and at risk of sinking.</p><p>Reuters irefighters try to extinguish a fire onboard the Gaza Freedom Flotilla vessel ConscienceReuters Firefighters try to extinguish the blaze on board the Conscience The Maltese government said a tugboat was sent to the scene to extinguish the fire, which they say was under control by 01:28 local time.</p><p>\"By 2:13, all crew were confirmed safe but refused to board the tug,\" the statement said, adding the ship remains outside territorial waters.</p><p>Cyprus responded to the SOS signal by dispatching a vessel, the activists said, but that it did not \"provide the critical electrical support needed\".</p><p>Marine tracking software shows that the Conscience left Tunisia on Tuesday evening and is currently around 12-14 nautical miles off Malta.</p><p>The coalition is campaigning to end Israel's blockade of Gaza, which is also facing mounting international condemnation. Last month the UK, French and German foreign ministers described the Israeli decision to block aid as \"intolerable\".</p><p>Gaza kitchens warn food will run out in days after two months of Israeli blockade Two months ago, Israel shut all crossings to Gaza – preventing all goods, including food, fuel and medicines from entering - and later resumed its military offensive, ending a two-month ceasefire with Hamas.</p><p>Some humanitarian organisations such as the World Food Programme say they have already run out of food while community kitchens say their stocks are dwindling fast. On Friday the Red Cross said the humanitarian response in Gaza was on the verge of \"total collapse\".</p><p>The Israeli military launched a campaign to destroy Hamas in response to an unprecedented cross-border attack on 7 October 2023, in which about 1,200 people were killed and 251 others were taken hostage.</p><p>At least 52,418 people have been killed in Gaza during the ensuing war, according to the territory's Hamas-run health ministry.</p><p>Additional reporting by Tom Bateman, Alice Cuddy and BBC Verify</p>",
        viewCount: initialViewCounts["gaza-activists-ship-drones"] || 0,
        downloadCount: initialDownloadCounts["gaza-activists-ship-drones"] || 0
    },
     {
        id: 'trump-trudeau-carney',
        headline: 'Trump disliked Trudeau - why Carney may fare better',
        summary: "Mark Carney's ascent as Canada's new prime minister offers a chance for a reset in the US-Canada relationship.",
        category: 'US & Canada', section: 'US & Canada',
        imageUrl: 'https://ichef.bbci.co.uk/news/480/cpsprodpb/37c6/live/d61a2670-26a6-11f0-b505-55b7c1f611de.jpg.webp',
        publishedAt: '6 hrs ago', layout: 'homepage-left',
        publishedISO: estimateISOString('6 hrs ago'),
        fullContent: `<p>The victory-party din for Mark Carney and his Liberal Party had only just faded when Donald Trump chimed in with a less than ringing endorsement of the winners.</p>
<p>"It was the one that hated Trump, I think, the least that won," the US president said on Wednesday of Carney, whose party had just retained power by winning a near outright majority of the seats in Canada's general election.</p>
<p>The Canadian prime minister may accept being the lesser of two evils in Trump's mind, however. The US president also said that he thinks the former Bank of England governor "couldn't have been nicer" in the first post-election phone conversation.</p>
<p>The two men are expected to meet at the White House sometime within the next week.</p>
<p>For Trump, politics is often personal. The president's affinity for Vladimir Putin colours US relations with Russia, for instance. His respect for Xi Jinping has kept US-China relations on a relatively even keel even as the two nations are engaging in an extended trade war.</p>
<p>Canada, on the other hand, has spent an extended time on the other end of this equation. Trump's distaste for former Prime Minister Justin Trudeau was palpable practically from the US president's first day in office in 2017.</p>
<p>The two leaders did not see eye to eye in Trump's first term - then things got worse. Their lengthy, aggressive handshake during their first in-person visit just a few weeks after Trump's inauguration foreshadowed what would be a long and trying relationship.</p>
<p>It was punctuated by passive-aggressive jabs, snide comments and, upon Trump's return to the White House, the president's derisive reference to "Governor Trudeau" and repeated talk of turning Canada into America's "cherished 51st state".</p>
<p>Trump's annexation talk continued even after Trudeau was replaced by Carney, but the temperature has seemed to drop somewhat, as the smooth international banker with a Harvard and Oxford pedigree replaced the younger, boyishly good looking Trudeau.</p>
<p>Trump, while he likes to rail against global elites, is drawn to Ivy League backgrounds and accumulated wealth, which Carney has in spades. And Carney has another attribute Trump tends to value - he's now a winner.</p>
<p>Even if he owes some of his victory to Trump's (negative) influence, the Liberal leader did engineer a remarkable reversal of fortune for his party when the outlook appeared gloomy just a few months before.</p>
<p>Carney and Trump are still a study in contrasts, something that presents risk for the former as their first meeting looms. The Canadian is measured, controlled and organised. Trump is impulsive and unpredictable. Both can be impatient at times, with little tolerance for the trivialities of modern politics.</p>
<p>There were reports that Trump brought up annexation during his first conversation with Carney after he became prime minister, but the Canadian leader kept that to himself and word only leaked weeks later - a characteristically cool response that may offer a hint of how he will handle Trump's bluster.</p>
<p>Paul Samson, president of the Centre for International Governance Innovation who has held various senior positions in Canadian government over 30 years, has seen Carney in action first-hand.</p>
<p>He tells the BBC that the new Canadian prime minister will likely use a mix of "economic knowledge, strategy and personal diplomacy" to get on Trump's good side.</p>
<p>"Carney likes to get things done," Mr Samson said. He is also calm, easy going and could connect with Trump on a personal level. "But he certainly does not want to come across as subservient."</p>
<p>If Carney heads into his first full term in office with a somewhat cleaner slate in dealing with the US president, it will still be a precarious situation.</p>
<p>While Canada has won a reprieve from some of the most onerous tariffs Trump initially announced on his nation, the clock is ticking - and striking some kind of settlement with the Americans will be no easy task.</p>
<p>"We will have a partnership on our terms," Carney told the BBC on Tuesday. "I would distinguish between what the president wants and what he expects."</p>
<p>Carney went on to say that Trump's "territorial views" on his country are "never, ever going to happen". It was a familiar message, one he delivered repeatedly on the campaign trail and in his election night victory speech.</p>
<p>"America wants our land, our resources, our water, our country," he said on Monday. "But these are not idle threats. President Trump is trying to break us so that America can own us."</p>
<p>Carney's rejection of an American takeover of Canada may not be enough to satisfy the US president, however. And it may not be possible for Carney and the Canadians to determine exactly what it is that Trump expects, either.</p>
<p>He has said Canada must do more to limit undocumented migration into the US, which is low, and cross-border fentanyl drug trafficking, which is minimal. He has also inflated the US-Canada trade deficit and said that the nation is "ripping off" America. Given the population disparity between the two nations and Canada's vast natural resources, a balanced trade ledger between the two could be an unreachable ask.</p>
<p>Whatever Trump and the Americans ultimately want, the US, as Canada's largest export market, has considerable power over its northern neighbour should it wish to exercise it. But, as Carney noted in his talk with the BBC, Canada isn't powerless either.</p>
<p>"We are the biggest client for more than 40 states," he said. "We supply them with vital energy, conventional energy and potentially could supply them with critical minerals."</p>
<p>He also said Canada could look to "like-minded countries" for more reliable trading partners, such as the UK or the EU, cutting the US out of the equation.</p>
<p>Doing so, however, would be abandoning a long and reliable partnership with the US, one that had been based on shared ideals as well as shared geography.</p>
<p>Trump's first 100 days back in the White House has called all of that into question, however.</p>
<p>It's a rift that seems unlikely to be fully mended, no matter how well Trump and Carney hit it off when they sit down in person to talk.</p>
<p><em>Additional reporting by Nadine Yousif in Toronto.</em></p>
<p><strong>Follow the twists and turns of Trump's second term with North America correspondent Anthony Zurcher's weekly US Politics Unspun newsletter.</strong></p>`,
        viewCount: initialViewCounts['trump-trudeau-carney'] || 0,
        downloadCount: initialDownloadCounts['trump-trudeau-carney'] || 0,
    },
    {
        "id": "harry-legal-challenge-security",
        "headline": "Prince Harry loses legal challenge over security he receives when in UK",
        "summary": "The Duke of Sussex had his UK security arrangements downgraded after stepping back from royal duties in 2020.",
        "category": "UK",
        "section": "UK",
        "imageUrl": "https://ichef.bbci.co.uk/news/480/cpsprodpb/0938/live/f9558aa0-275d-11f0-8c66-ebf25fc2cfef.jpg.webp",
        "publishedAt": "Just updated",
        "isLive": true,
        "layout": "homepage-hero",
        "publishedISO": estimateISOString("Just updated"),
        "fullContent": "<p>Prince Harry said he was \"devastated\" after losing his appeal over the downgrade of his UK security. Speaking to the BBC, he said he would \"struggle to forgive\" the decision, which leaves him unable to safely bring his family to Britain.</p> <p>Harry, who now lives in California with his wife Meghan and their two children, had challenged a decision by the Home Office, made in 2020, that he would no longer automatically receive publicly-funded police protection while in the UK. London's High Court had previously ruled that decision lawful, and on Friday, the Court of Appeal upheld it.</p> <p>The judges acknowledged Harry's concerns but stated that feeling aggrieved does not amount to a legal error. Harry claimed that security had been used as leverage to pressure him and Meghan to remain within the royal fold. \"What I'm struggling to forgive is that a decision made in 2020 affects my every single day and is knowingly putting me and my family in harm's way,\" he said.</p> <p>The Home Office welcomed the decision, stating that the UK's protective security system is \"rigorous and proportionate.\" Buckingham Palace also emphasized that these matters had been thoroughly reviewed by the courts multiple times.</p> <p>Harry’s lawyer argued that his life was at risk, citing threats from al Qaeda and a 2023 car chase with paparazzi in New York. However, the court maintained that the bespoke security arrangements made by the Executive Committee for the Protection of Royalty and Public Figures (RAVEC) were appropriate given his status after stepping down as a senior royal.</p> <p>Referring to his mother Princess Diana’s fatal car crash while fleeing paparazzi in 1997, Harry stated: \"I don't want history to repeat itself.\" He added, \"Through the disclosure process I've discovered that some people want history to repeat itself, which is pretty dark.\"</p> <p>Harry attended two days of court hearings in April and said he has no intention of further appealing the ruling to the UK Supreme Court, adding that \"at the heart of it, this is a family dispute.\" His broader concerns with press intrusion continue, as his lawsuit—alongside Elton John and others—against Associated Newspapers returns to the High Court next week.</p> <p>In January, he was awarded substantial damages by Rupert Murdoch’s media group for previous privacy violations.</p><p>Prince Harry said he was \"devastated\" after losing his appeal over the downgrade of his UK security. Speaking to the BBC, he said he would \"struggle to forgive\" the decision, which leaves him unable to safely bring his family to Britain.</p> <p>Harry, who now lives in California with his wife Meghan and their two children, had challenged a decision by the Home Office, made in 2020, that he would no longer automatically receive publicly-funded police protection while in the UK. London's High Court had previously ruled that decision lawful, and on Friday, the Court of Appeal upheld it.</p> <p>The judges acknowledged Harry's concerns but stated that feeling aggrieved does not amount to a legal error. Harry claimed that security had been used as leverage to pressure him and Meghan to remain within the royal fold. \"What I'm struggling to forgive is that a decision made in 2020 affects my every single day and is knowingly putting me and my family in harm's way,\" he said.</p> <p>The Home Office welcomed the decision, stating that the UK's protective security system is \"rigorous and proportionate.\" Buckingham Palace also emphasized that these matters had been thoroughly reviewed by the courts multiple times.</p> <p>Harry’s lawyer argued that his life was at risk, citing threats from al Qaeda and a 2023 car chase with paparazzi in New York. However, the court maintained that the bespoke security arrangements made by the Executive Committee for the Protection of Royalty and Public Figures (RAVEC) were appropriate given his status after stepping down as a senior royal.</p> <p>Referring to his mother Princess Diana’s fatal car crash while fleeing paparazzi in 1997, Harry stated: \"I don't want history to repeat itself.\" He added, \"Through the disclosure process I've discovered that some people want history to repeat itself, which is pretty dark.\"</p> <p>Harry attended two days of court hearings in April and said he has no intention of further appealing the ruling to the UK Supreme Court, adding that \"at the heart of it, this is a family dispute.\" His broader concerns with press intrusion continue, as his lawsuit—alongside Elton John and others—against Associated Newspapers returns to the High Court next week.</p> <p>In January, he was awarded substantial damages by Rupert Murdoch’s media group for previous privacy violations.</p>",
        "viewCount": initialViewCounts["harry-legal-challenge-security"] || 0,
        "downloadCount": initialDownloadCounts["harry-legal-challenge-security"] || 0
    },
    {
        "id": "afd-germany-intelligence",
        "headline": "AfD classified as extreme-right by German intelligence",
        "summary": "The AfD came second in Germany's February elections and has a record number of seats in the new parliament.",
        "category": "Europe",
        "section": "Europe",
        "publishedAt": "2 hrs ago",
        "layout": "homepage-right",
        "imageUrl": "https://ichef.bbci.co.uk/news/1024/cpsprodpb/6b19/live/e3b6f9f0-274d-11f0-8c66-ebf25fc2cfef.jpg.webp",
        "publishedISO": estimateISOString("2 hrs ago"),
        "fullContent": "<p>Germany's Alternative für Deutschland (AfD) party has been designated as right-wing extremist by the country's federal office for the protection of the constitution.</p>\
    <p>\"The ethnicity- and ancestry-based understanding of the people prevailing within the party is incompatible with the free democratic order,\" the domestic intelligence agency said in a statement.</p>\
    <p>The German foreign ministry defended the decision after US Secretary of State Marco Rubio called the move \"tyranny in disguise\" and Vice-President JD Vance said the Berlin Wall was being rebuilt.</p>\
    <p>The AfD came second in federal elections in February, winning a record 152 seats in the 630-seat parliament with 20.8% of the vote.</p>\
    <p>The parliament, or Bundestag, will hold a vote next week to confirm conservative leader Friedrich Merz as chancellor, heading a coalition with the centre-left Social Democrats.</p>\
    <p>AfD joint leaders Alice Weidel and Tino Chrupalla said the decision was \"clearly politically motivated\" and a \"severe blow to German democracy\". They argued their party was being \"discredited and criminalised\" shortly before the change of government.</p>\
    <p>The far-right AfD had already been placed under observation for suspected extremism in Germany, and the intelligence agency had also classed it as right-wing extremist in three states in the east, where its popularity is highest.</p>\
    <p>The agency, or Verfassungsschutz, said specifically that the AfD did not consider citizens of a \"migration background from predominantly Muslim countries\" as equal members of the German people.</p>\
    <p>AfD deputy chairman Stephan Brandner said the decision was \"complete nonsense, has absolutely nothing to do with law and order\".</p>\
    <p>However, acting Interior Minister Nancy Faeser said the agency had made a clear and unambiguous decision with \"no political influence whatsoever\", after a comprehensive review and a report of 1,100 pages.</p>\
    <p>Bundestag Vice-President Andrea Lindholz said that as a designated right-wing extremist group the AfD should not be treated as other parties, especially in parliament.</p>\
    <p>Because of their large number of seats, AfD members could be eligible to chair parliamentary committees, but Lindholz said that idea was now \"almost unthinkable\".</p>\
    <p>After their election success, AfD leaders said the so-called firewall that had prevented other parties from working with them should end.</p>\
    <p>\"Anyone who erects firewalls will get grilled behind them,\" said Tino Chrupalla.</p>\
    <p>Having doubled its share of the vote in under four years, Chrupalla's party is still second in the opinion polls behind Merz's conservatives, despite several scandals, including one high-profile member being convicted of using banned Nazi slogans.</p>\
    <p>Earlier this year Alice Weidel embraced the term \"remigration\", widely seen as meaning the mass deportation of people with a migrant background, although she rejected that definition.</p>\
    <p>The AfD also attracted the support of leading figures in the Trump administration. Nine days before the election, US Vice-President JD Vance met Weidel in Munich and said there was no place for \"firewalls\", alleging that free speech was in retreat in Europe.</p>\
    <p>Tech billionaire Elon Musk gave Weidel a long audience in a livestreamed chat on X and called on Germans to vote for the AfD. He then repeatedly posted his support for Weidel's party in the run-up to the election.</p>\
    <p>On Friday JD Vance posted on X that \"the AfD is the most popular party in Germany, and by far the most representative of East Germany. Now the bureaucrats try to destroy it.\"</p>\
    <p>He also accused the \"German establishment\" of rebuilding the Berlin Wall - a reference to the barrier built in 1961 to separate East and West Berlin during the Cold War.</p>\
    <p>US Secretary of State Marco Rubio said the decision taken by the German intelligence agency meant it had been given \"new powers to surveil the opposition. That's not democracy - it's tyranny in disguise\".</p>\
    <p>This prompted a rare retort from the German Foreign Office.</p>\
    <p>\"This is democracy,\" it posted on X. \"We have learnt from our history that rightwing extremism needs to be stopped.\"</p>\
    <p>Map shows support for AfD in eastern Germany</p>\
    <p>As part of its role in ensuring Germany's \"free democratic basic order\", the domestic intelligence agency is responsible for both counter-intelligence and investigating terror threats.</p>\
    <p>Although its change in designation of the AfD is expected to be challenged in the courts, it would likely lower the threshold for the agency using informants and surveillance in monitoring the party.</p>\
    <p>Some German politicians have said the party's new designation should lead to a ban.</p>\
    <p>Under Germany's Basic Law - a constitution adopted in 1949 four years after the fall of Hitler's Nazi regime - parties that \"deliberately undermine the functioning of Germany's free democratic basic order\" can be banned if they act in a \"militant and aggressive way\".</p>\
    <p>Domestic intelligence cannot push for a ban on the party - that can only go through the two houses of parliament, government or the constitutional court - but its latest decision could encourage others to start the process.</p>\
    <p>Outgoing Chancellor Olaf Scholz warned against rushing into a decision, but Heidi Reichinnek of the Left Party said no-one could accept that \"a proven right-wing extremist party is fighting and destroying our democracy from within\".</p>\
    <p>Since the war, the constitutional court has banned only two parties, both in the 1950s.</p>\
    <p>The Christian Democrat state premier of Schleswig-Holstein in northern Germany called on the incoming government to initiate proceedings to ban the AfD. Daniel Günther told Spiegel magazine that the party presented a risk to \"social harmony\".</p>\
    <p>But Michael Kretschmer, the Christian Democrat premier in the eastern state of Saxony, was quoted as saying that the \"enemies of democracy are not fought solely by the state - defence of democracy begins in the heart of society\".</p>\
    <p>In a further post on X, Musk argued on Friday that banning \"the centrist AfD\", which he also labelled Germany's most popular party, \"would be an extreme attack on democracy\".</p>\
    <p>The deputy leader of the Social Democrat SPD, Serpil Midyatli, said it was now in black and white what everybody already knew. \"It's clear for me that the ban has to come,\" she said, according to German press agency dpa.</p>\
    <p>Regardless of the AfD's election success, she said the founding fathers of Germany's post-war constitution had sought to ensure the country would not be plunged back into the abyss.</p>",
        "viewCount": initialViewCounts["afd-germany-intelligence"] || 0,
        "downloadCount": initialDownloadCounts["afd-germany-intelligence"] || 0
    },
    {
        id: 'chile-tsunami-warning',
        headline: 'Chile issues tsunami warning after earthquake',
        summary: 'The warning is issued for parts of the remote Magallanes region after a 7.4 magnitude earthquake strikes off the coast.',
        category: 'Latin America',
        section: 'Latin America',
        publishedAt: '19 mins ago',
        layout: 'homepage-right',
        imageUrl: 'https://ichef.bbci.co.uk/news/1024/cpsprodpb/99a5/live/e6e77660-276e-11f0-8c66-ebf25fc2cfef.jpg.webp',
        publishedISO: estimateISOString('19 mins ago'),
        fullContent: '<p>Coastal areas of Chile and Argentina were evacuated after Chilean authorities issued a tsunami warning following a 7.4 magnitude earthquake off the country\'s southern coast.</p><p>Thousands of people made their way to higher ground after the earthquake struck in the Drake Passage between Cape Horn, on the southern tip of South America, and Antarctica on Friday at 09:58 local time (12:58 GMT).</p><p>The US Geological Survey said its epicentre was 219km (136 miles) from Ushuaia, Argentina - the world\'s most southerly city.</p><p>The tsunami warning was issued for Chile\'s remote Magallanes region and the Chilean Antarctic Territory, with precautionary measures also taken in Argentina\'s Tierra del Fuego region.</p><p>The earthquake struck at a shallow depth of 10km (6 miles), the US Geological Survey said. There were no immediate reports of damage or injuries.</p><p>Residents in affected areas were advised to act calmly and follow the instructions of the authorities.</p><p>In a post on X, Chilean President Gabriel Boric said: "We call for evacuation of the coastline throughout the Magallanes region."</p><p>More than 1,700 people moved to higher ground in the sparsely-populated area, including 1,000 from the town of Puerto Williams and 500 from Puerto Natales, according to Chile\'s disaster agency (Senapred).</p><p>Some 32 people also followed evacuation procedures in Chile\'s Antarctic research bases, Senapred added. The agency has issued its highest level of alert for disasters, meaning all resources can be mobilised to respond.</p><p>Footage posted on social media showed people calmly heading for higher ground in the remote town of Puerto Williams, with sirens blaring in the background.</p><p>Chile\'s police force also posted a video showing an officer pushing a person in a wheelchair up a hill in the town, home to around 2,800 people.</p><p>In Argentina, the earthquake was felt primarily in Ushuaia, with other towns affected "to a lesser extent", the office for the governor of the region said.</p><p>An official from the region\'s civil protection agency told local media that around 2,000 people had been evacuated away from the Argentine coastline.</p><p>Chile is often affected by earthquakes, with three tectonic plates converging within its territory.</p>',
        viewCount: initialViewCounts['chile-tsunami-warning'] || 0,
        downloadCount: initialDownloadCounts['chile-tsunami-warning'] || 0
    },
    {
        id: 'jill-sobule-house-fire',
        headline: 'Groundbreaking musician Jill Sobule dies in house fire',
        summary: 'Her song I Kissed a Girl is widely considered the first openly gay-themed song to crack the Billboard Top 20.',
        category: 'Culture',
        section: 'Culture',
        publishedAt: '11 hrs ago',
        layout: 'homepage-right',
        imageUrl: 'https://ichef.bbci.co.uk/news/1024/cpsprodpb/e7e4/live/318b2e10-2705-11f0-b9f4-cb87962b72bc.jpg.webp',
        publishedISO: estimateISOString('11 hrs ago'),
        fullContent: '<p>Jill Sobule, a groundbreaking US songwriter whose hit I Kissed a Girl is widely considered the first song with openly-gay themes to crack the Billboard Top 20, has died in a house fire in Minneapolis, Minnesota, her publicist has said.</p><p>Sobule, whose satirical anthem Supermodel featured in the 1995 coming-of-age film Clueless, was 66.</p><p>She had been due to perform on Friday in her home city of Denver, Colorado to showcase songs from her autobiographical stage musical. A free gathering will now take place in her honour.</p><p>Tributes have been pouring in on social media, including from English musician Lloyd Cole, who said: "I\'m really too numb to post much of anything. We loved her. She loved us."</p><p>Born in 1959, Sobule\'s career spanned three decades, her music dealing with topics including the death penalty, anorexia and LGBTQ+ rights.</p><p>Her most famous work came on her eponymous 1995 album, which included Supermodel and I Kissed a Girl.</p><p>The latter drew renewed attention in 2008 when Katy Perry released a different single of her own with the same title.</p><p>Sobule later became a pioneer of using crowdfunding to release albums, and wrote music for theatre and television shows, including the theme for the Nickelodeon show Unfabulous.</p><p>John Porter, Sobule\'s manager, said she was a "force of nature and human rights advocate whose music is woven into our culture".</p><p>He continued: "I was having so much fun working with her. I lost a client & a friend today. I hope her music, memory, & legacy continue to live on and inspire others."</p><p>Eric Alper, a Canadian music correspondent, posted on X that she "paved the way with heart, humour, and honesty", adding that the openly gay artist "changed the soundtrack - and the conversation".</p><p>"Jill Sobule was so special. Heartbreaking news," American actress Carrie Coon posted.</p><p>Police in the suburb of Woodbury are investigating the cause of the fire at the house where Sobule was found, the Star Tribune reported.</p>',
        viewCount: initialViewCounts['jill-sobule-house-fire'] || 0,
        downloadCount: initialDownloadCounts['jill-sobule-house-fire'] || 0
    },
    {
        id: 'russell-brand-bail',
        headline: 'Russell Brand granted bail after court appearance',
        summary: 'The broadcaster, comedian and actor faces charges of rape, sexual assault and indecent assault.',
        category: 'Culture',
        section: 'Culture',
        publishedAt: '4 hrs ago',
        layout: 'homepage-right',
        imageUrl: 'https://ichef.bbci.co.uk/news/1024/cpsprodpb/806d/live/53bca1f0-2730-11f0-8c66-ebf25fc2cfef.jpg.webp',
        publishedISO: estimateISOString('4 hrs ago'),
        fullContent: '<p>Russell Brand has been granted bail and left Westminster Magistrates\' Court in London, after facing charges of rape, sexual assault and indecent assault.</p><p>The broadcaster, comedian and actor faces one allegation of rape, one allegation of indecent assault, one of oral rape and two further counts of sexual assault, relating to four separate women.</p><p>Photographers surrounded his car as he arrived, and he did not speak to the reporters gathered outside the court building.</p><p>Surrounded by cameras and microphones, it took him more than two minutes to walk the short distance to the court door, passing alongside blocks of photographers, who were flanked by police officers.</p><p>Brand confirmed his name and address in court, and that he is aged 49.</p><p>He is accused of sexually assaulting a woman by touching her breasts and indecently assaulting another by grabbing her arm and dragging her towards a male toilet.</p><p>Brand, who was asked to stand in court for the 12-minute hearing, did not enter a plea.</p><p>He was charged by post last month.</p><p>The case will be heard at the Old Bailey.</p><p>His next court appearance will be 30 May, and he confirmed during the hearing that he understood his bail conditions.</p><p>Brand, who was born in Essex, rose to fame as a stand-up comedian, performing at the Hackney Empire in 2000 and later the Edinburgh Fringe.</p><p>He later moved into broadcasting, hosting national television and radio programmes.</p><p>The turning point in his career came in the mid-2000s, when he hosted Big Brother\'s Big Mouth, a companion show to the hugely popular reality series Big Brother.</p><p>It provided the springboard he was looking for and led to him becoming one of the most sought-after presenters in the UK.</p><p>Brand went on to host the NME, MTV and Brit awards ceremonies, had his own debate series by E4, and fronted the UK leg of charity concert Live Earth.</p><p>His career included hosting radio shows on the BBC, in particular for 6 Music and Radio 2, between 2006 and 2008.</p><p>Brand released a video in April in which he said he had never engaged in non-consensual activity and was grateful for the opportunity to defend the charges in court.</p><p>The case follows an investigation by the Sunday Times, the Times and Channel 4\'s Dispatches in September 2023, which revealed multiple serious allegations against him.</p>',
        viewCount: initialViewCounts['russell-brand-bail'] || 0,
        downloadCount: initialDownloadCounts['russell-brand-bail'] || 0
    }
];

// --- Storage Logic ---
const getCurrentCount = (id, countType = 'view') => {
    const article = mockArticles.find(article => article?.id === id);
    const key = countType === 'view' ? 'viewCount' : 'downloadCount';
    const initialCountMap = countType === 'view' ? initialViewCounts : initialDownloadCounts;
    const initialCount = initialCountMap[id] ?? article?.[key] ?? 0;
    const storageKey = `${key}_${id}`;
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? (parseInt(storedValue, 10) || initialCount) : initialCount;
};

export const getArticleById = (id) => {
    const article = mockArticles.find(article => article.id === id);
    if (!article) return null;
    const currentViewCount = getCurrentCount(id, 'view');
    const currentDownloadCount = getCurrentCount(id, 'download');
    return { ...article, viewCount: currentViewCount, downloadCount: currentDownloadCount };
}

export const incrementArticleViewCount = (id) => {
    const currentViewCount = getCurrentCount(id, 'view');
    const newViewCount = currentViewCount + 1;
    localStorage.setItem(`viewCount_${id}`, newViewCount.toString());
    window.dispatchEvent(new CustomEvent(`viewsUpdated_${id}`));
    return newViewCount;
}

export const incrementArticleDownloadCount = (id) => {
    const currentDownloadCount = getCurrentCount(id, 'download');
    const newDownloadCount = currentDownloadCount + 1;
    localStorage.setItem(`downloadCount_${id}`, newDownloadCount.toString());
    window.dispatchEvent(new CustomEvent(`downloadsUpdated_${id}`));
    return newDownloadCount;
}