import type { NetworkDirectoryMember } from "@/lib/content/network-directory";

export const directoryGroups = [
  { slug: "artists", label: "Art & illustration", title: "Artists and illustrators", description: "There's a lot of brilliant art being made up here. Get to know the North East artists and illustrators behind it, see what they're creating and find someone whose work stays with you." },
  { slug: "photographers", label: "Photography & film", title: "Photographers and filmmakers", description: "North East photographers and filmmakers have a way of showing us things we might have missed. Have a look at their work, follow along and find someone to make your next idea with." },
  { slug: "designers", label: "Designers & studios", title: "Designers, architects and creative studios", description: "Good design can change how a place, product or idea feels. Get to know the North East designers, architects and studios putting their own thinking into the work." },
  { slug: "makers", label: "Makers & craft", title: "Makers and craftspeople", description: "There's something special about knowing who made the thing you love. Meet North East makers and craftspeople, see what they're creating and put a name to the hands behind the work." },
  { slug: "music", label: "Music & audio", title: "Musicians and audio creatives", description: "There's plenty of sound worth listening to coming out of the North East. Find musicians, recording studios and audio creatives to follow, support or make something with." },
  { slug: "performance", label: "Performance", title: "Performers", description: "You see the finished performance. Here, you can get to know the people who put themselves into it. Find North East dancers, actors, models and other performers doing their thing." },
  { slug: "writing-content", label: "Writing & content", title: "Writers and content creatives", description: "The right words can make someone feel seen or help an idea finally land. Meet North East writers and content creatives, read their work and find someone to help tell your story." },
  { slug: "community-events", label: "Community & events", title: "Creative communities and events", description: "Somebody has to bring people together and make space for things to happen. Get to know the North East event organisers and community builders doing that work for creatives." },
  { slug: "independent-businesses", label: "Independent businesses", title: "Independent businesses", description: "Behind every independent business is someone putting their time and heart into it. Explore North East independent businesses, meet the people running them and show some love locally." },
  { slug: "creative-services", label: "Creative services", title: "Creative services", description: "Got an idea that could use another pair of hands? Find North East creative services and the people behind them, whether you need help with a project or want to make a new connection." },
] as const;

export type DirectoryGroupSlug = (typeof directoryGroups)[number]["slug"];

// Reviewed against each member's submitted category and public directory bio.
// Each current member has one main browsing home; the original category remains on their card.
const reviewedPrimaryGroupById: Record<string, DirectoryGroupSlug> = {
  // creative-services
  "joe-wilson-nami-creative": "creative-services", // Joe Wilson / NAMI Creative
  "kae-beth": "creative-services", // Kae Beth
  "miriam-yaya": "creative-services", // Miriam Yaya
  // artists
  "grafik-21-andrew-wright": "artists", // Andrew Wright / Grafik 2.1
  "alex-davis-art-vibes-newcastle": "artists", // Alex Davis / Art Vibes Newcastle
  "alice-stainthorpe": "artists", // Alice Stainthorpe
  "amanda-jo": "artists", // Amanda Jo
  "amelie-smith": "artists", // Amelie Smith
  "bex-masters": "artists", // Bex Masters
  "bruce-parker": "artists", // Bruce Parker
  "canny-cool-prints": "artists", // Canny Cool Prints
  "dale-binney": "artists", // Dale Binney
  "danielle-stephenson": "artists", // Danielle Stephenson
  "deb-cooper": "artists", // Deb Cooper
  "donna": "artists", // Donna
  "elliott-mccann": "artists", // Elliott McCann
  "emily-hline": "artists", // Emily Hline
  "faythe-lockwood": "artists", // Faythe Lockwood
  "finch": "artists", // Finch
  "glenda-turnbull": "artists", // Glenda Turnbull
  "hels": "artists", // Hels
  "imogen-andrews": "artists", // Imogen Andrews
  "jemma-marsh": "artists", // Jemma Marsh
  "jolene-lowe": "artists", // Jolene Lowe
  "joseph-marsh": "artists", // Joseph Marsh
  "karen-ruffles": "artists", // Karen Ruffles
  "kate-anderson": "artists", // Kate Anderson
  "kate-miller": "artists", // Kate Miller
  "katie-rzedzian": "artists", // Katie Rzedzian
  "kelly-morgan": "artists", // Kelly Morgan
  "kim-mcdermottroe": "artists", // Kim McDermottroe
  "larissa-padgett": "artists", // Larissa Padgett
  "laura-black": "artists", // Laura Black
  "laura-miller": "artists", // Laura Miller
  "laura-moore": "artists", // Laura Moore
  "lauren-shakespeare": "artists", // Lauren Shakespeare
  "leona-armstrong": "artists", // Leona Armstrong
  "lewis-dimmick": "artists", // Lewis Dimmick
  "liv-askwith": "artists", // Liv Askwith
  "mark-ingram": "artists", // Marko Ingram
  "melanie-heaps": "artists", // Melanie Heaps
  "melissa-duncan": "artists", // Melissa Duncan
  "natasha-armstrong": "artists", // Natasha Armstrong
  "nicola-irwin": "artists", // Nicola Irwin
  "paul-wright": "artists", // Paul Wright
  "rachel-blackwell": "artists", // Rachel Blackwell
  "robert": "artists", // RFH
  "robrez": "artists", // RobRez
  "sally-anderson-sally-anderson": "artists", // Sally Anderson
  "sarah-pavlou": "artists", // Sarah Pavlou
  "sarah-lee-bailey": "artists", // Sarah-Lee Bailey
  "seher-sadiq": "artists", // Seher Sadiq
  "sophie-stewart": "artists", // Sophie Stewart
  "stase-jenny": "artists", // Stase Jenny
  "steve-lyon-bowes": "artists", // Steve Lyon-Bowes
  "sue-ridley-art": "artists", // Sue Ridley Art
  "suzie-smith": "artists", // Suzie Smith
  "twisted-figments": "artists", // Twisted Figments
  "scott-laird-cbafdf86": "artists", // Scott Laird
  "katie-brydon-ff161079": "artists", // Katie Brydon
  "lu-farthey-c0d3cd68": "artists", // lu farthey
  "melissa-quinn-2d9d64bb": "artists", // Melissa Quinn
  "izzy-curran-1e4519c7": "artists", // Izzy Curran
  "bobby-page-994477a4": "artists", // Bobby Page
  "stephen-fowler-487d90bb": "artists", // Stephen Fowler
  "albert-bluett-b-c-7e51c415": "artists", // Albert Bluett B-C
  "all-things-bloom-art-4399ccdb": "artists", // All Things Bloom Art
  // photographers
  "andi-talbot": "photographers", // Andi Talbot
  "charlie-jobling-jones": "photographers", // Charlie Jobling-Jones
  "danielle-cosgrove": "photographers", // Danielle Cosgrove
  "david-jackson": "photographers", // David Jackson
  "ellie-armstrong": "photographers", // Ellie Armstrong
  "eoin-kavanagh": "photographers", // Eoin Kavanagh
  "haydn-brown": "photographers", // Haydn Brown
  "james-robinson": "photographers", // James Robinson
  "jessie-gaffney": "photographers", // Jessie Gaffney
  "jonas-kontautas": "photographers", // Jonas Kontautas
  "neil-johnson": "photographers", // Neil Johnson
  "nicola-hunter": "photographers", // Nicola Jay
  "ralph-deloso": "photographers", // Ralph Deloso
  "sserrated": "photographers", // SSERRATED
  "steven-wilson": "photographers", // Steven Wilson
  "jodie-beardmore-680da2d8": "photographers", // Jodie Beardmore
  "tyla-faye-jackson-c5ef0ace": "photographers", // Tyla-Faye Jackson
  "sway-6352351c": "photographers", // Sway
  "chris-crampton-42539145": "photographers", // Chris Crampton
  "krzysztof-furgala-ef1077fa": "photographers", // Krzysztof Furgala
  "steve-hodgson-508e17e1": "photographers", // Steve Hodgson
  "elijah-moore-d802baf0": "photographers", // Elijah Moore
  // designers
  "catherine-muir": "designers", // Catherine Muir
  "ellie-gair": "designers", // Ellie Gair
  "heather-close": "designers", // Heather Close
  "jack-alberts---trigo-studio": "designers", // Jack Alberts / Trigo Studio
  "jack-holden": "designers", // Jack Holden
  "katie-dyer": "designers", // Katie Dyer
  "kelly-smith": "designers", // Kelly Smith
  "laura-crow": "designers", // Laura Crow
  "lewis-paul-farrow": "designers", // Lewis Paul Farrow
  "mike": "designers", // Mike
  "richard": "designers", // Richard
  "rolo": "designers", // Studio Dariolina
  "sam-aylard": "designers", // Sam Aylard
  "sarah-carlton-designbykinship": "designers", // Sarah Carlton / Design by Kinship
  "sean-hunter-edgar": "designers", // Sean Hunter-Edgar
  "jem-solley-0d037893": "designers", // Jem Solley
  "lucy-minta-reeves-b4807ed3": "designers", // Lucy Minta Reeves
  "graeme-smith-26aa4c64": "designers", // Graeme Smith
  "phillip-brown-0fb8dc6f": "designers", // Phillip Brown
  "clare-lavelle-071c00ea": "designers", // Clare Lavelle / Aniseed Creative
  "joe-shimwell-eec46703": "designers", // Joe Shimwell
  "eleanor-osada-6226630b": "designers", // Eleanor Osada
  // makers
  "amanda-mulholland": "makers", // Amanda Mulholland / Tittle the Brick
  "amy-richardson": "makers", // Amy Richardson
  "brandon-turner": "makers", // Brandon Turner
  "brittania-douglas": "makers", // Brittania Douglas
  "ellie-grassick": "makers", // Ellie Grassick
  "forbes-finishings": "makers", // Forbes Finishings
  "gabrielle-binks": "makers", // Gabrielle Binks
  "grace-raymond-burrows": "makers", // Grace Raymond-Burrows
  "jill-lewis": "makers", // Jill Lewis
  "jo-lamoureux": "makers", // Jo Lamoureux
  "michael-clark": "makers", // Michael Clark
  "nicola-jane-hall": "makers", // Nicola Jane Hall
  "nicole-pook": "makers", // Nicole Pook
  "varie-freyne": "makers", // Varie Freyne
  "joanne-hunt-ed78c60d": "makers", // Joanne Hunt
  "melissa-parkinson-521adf48": "makers", // Milly B Designs
  "julie-02ae7deb": "makers", // Julie
  "kiri-nicholetts-many-moons-d63128fc": "makers", // Kiri Nicholetts, Many Moons
  "wilou-designs-01c205c4": "makers", // WILOU Designs
  // music
  "alexei-crawley": "music", // Alexei Crawley
  "jamie-lee-harrison": "music", // Jamie Lee Harrison
  "jody-irving": "music", // Jody Irving
  "laura-rosierse": "music", // Laura Rosierse
  "mark-folland": "music", // Mark Folland
  "pointy-features-dan": "music", // Pointy Features (Dan)
  "strike-promotions": "music", // Strike Promotions
  "heywood-dab1d954": "music", // Heywood
  "annie-enclave-45460923": "music", // Annie Enclave
  "scapey-240d9299": "music", // scapey
  "ambar-dhesi-e0953377": "music", // Ambar Dhesi
  "sip-happens-44c98391": "music", // Sip happens
  // performance
  "chrissy": "performance", // Chrissy
  "emma-bloomfield": "performance", // Emma Bloomfield
  "maeve-winters": "performance", // Maeve Winters
  "maxine-fell---northern-dance": "performance", // Maxine Fell / Northern Dance
  "southpaw-company": "performance", // Southpaw Company
  "thorn-woods": "performance", // Thorn Faustus
  "sophie-jane-williams-f7dccf31": "performance", // Sophie-Jane Williams
  // writing-content
  "amanda-edmiston": "writing-content", // Amanda Edmiston
  "ellen-barr": "writing-content", // Ellen Barr
  "jennifer-parkins": "writing-content", // Jennifer Parkins
  "joanna-long": "writing-content", // Joanna Long
  "lewis": "writing-content", // Lewis
  "nicholle": "writing-content", // Nicholle
  "sue-reed": "writing-content", // Sue Reed
  "tyger-comms": "writing-content", // Tyger Comms
  // community-events
  "auburn-langley": "community-events", // Auburn Langley
  "joanne-lowes": "community-events", // Joanne Lowes
  "northern-display-painters-guild": "community-events", // Northern Display Painters Guild
  "rebecca-ridley": "community-events", // Rebecca Ridley
  "sarah-carlton-billynomates-cowork": "community-events", // Sarah Carlton / Billy No Mates
  "mel-eaton-59680527": "community-events", // Mel Eaton
  // independent-businesses
  "andrew-miller": "independent-businesses", // Andrew Miller
  "emma-moffat-knox": "independent-businesses", // Emma Moffat-Knox
  "gayle-foster": "independent-businesses", // Gayle Foster
  "jessica-penrose": "independent-businesses", // Jessica Penrose
  "phil-davison-nice-face-apparel": "independent-businesses", // Phil Davison (Nice Face Apparel)
  "rach": "independent-businesses", // Rach
  "reuven-fletcher": "independent-businesses", // Reuven Fletcher
  "su-devine": "independent-businesses", // Su Devine
  "jerk-it-together-6eccd55c": "independent-businesses", // Jerk it together
  "samantha-jane-robinson-4acf8a85": "independent-businesses", // Samantha Jane Robinson
  "luke-westgate-b70c1dee": "independent-businesses", // Luke Westgate
  "rickiah-quinn-8e0ca5b7": "independent-businesses", // Rickiah Quinn
  "katie-adams-3f04abdc": "independent-businesses", // Katie Adams
  "the-backyard-32896402": "independent-businesses", // The Backyard
};

export function primaryMemberGroup(member: NetworkDirectoryMember): DirectoryGroupSlug {
  const selected = directoryGroups.find((group) => member.primaryGroup === group.label || member.primaryGroup === group.slug);
  if (selected) return selected.slug;
  const reviewed = reviewedPrimaryGroupById[member.id];
  if (reviewed) return reviewed;

  // Keep new, unreviewed entries in one safe group until their main offering is checked.
  const category = member.category.toLowerCase();
  if (category === "artist" || category.includes("illustrat") || category.includes("tattoo artist")) return "artists";
  if (category.includes("photograph") || category.includes("film") || category.includes("video")) return "photographers";
  if (category.includes("design") || category.includes("architect") || category.includes("animat")) return "designers";
  if (category.includes("music") || category.includes("recording") || category.includes("audio") || category.includes("podcast") || category.includes("pod cast") || category.includes("singer")) return "music";
  if (category.includes("perform") || category.includes("dance") || category === "model") return "performance";
  if (category.includes("writer") || category.includes("journalist") || category.includes("content")) return "writing-content";
  if (category.includes("community") || category.includes("event")) return "community-events";
  if (category.includes("business") || category.includes("trainer") || category.includes("nail")) return "independent-businesses";
  if (category.includes("maker") || category.includes("craft") || category.includes("ceramic") || category.includes("jewel")) return "makers";
  return "creative-services";
}

export function memberGroupSlugs(member: NetworkDirectoryMember): DirectoryGroupSlug[] {
  return [primaryMemberGroup(member)];
}

export function membersInGroup(members: NetworkDirectoryMember[], slug: DirectoryGroupSlug) {
  return members.filter((member) => memberGroupSlugs(member).includes(slug));
}

export function dailyMemberPreview(members: NetworkDirectoryMember[], day: number, count = 4) {
  if (members.length <= count) return members;
  const ordered = [...members].sort((a, b) => a.id.localeCompare(b.id));
  const start = ((day * count) % ordered.length + ordered.length) % ordered.length;
  return Array.from({ length: count }, (_, index) => ordered[(start + index) % ordered.length]);
}

export function londonDayNumber(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Math.floor(Date.UTC(Number(value.year), Number(value.month) - 1, Number(value.day)) / 86_400_000);
}
