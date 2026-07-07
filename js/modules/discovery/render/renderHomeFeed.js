/* ============================================
   TRAVVANA — Render Home Feed (Premium Redesign)
   Netflix-style content browsing with cinematic imagery
   4 cards per row, 2 rows, paginated "More" button
   ============================================ */

import { CONFIG } from '../../../core/config.js';
import { setHTML, skeletonCards, escapeHTML } from '../../../utils/dom.js';
import { STATE_IMAGES, STATE_ATTRACTIONS } from '../../../data/sharedStateData.js';
import { unifiedSearchBar } from '../components/searchBar.js';

//* ── All Popular Destinations (linked to assets/images/popular/) ── */
export const ALL_DESTINATIONS = [
  { id: 'taj-mahal', name: 'Taj Mahal', location: 'Uttar Pradesh', image: 'assets/images/popular/taj-mahal.jpg', slug: 'taj-mahal', stateId: 'uttar-pradesh' },
  { id: 'golden-temple', name: 'Golden Temple', location: 'Punjab', image: 'assets/images/popular/golden-temple.png', slug: 'golden-temple', stateId: 'punjab' },
  { id: 'tirumala-venkateswara-temple', name: 'Tirumala Venkateswara Temple', location: 'Andhra Pradesh', image: 'assets/images/popular/tirupati-balaji.jpg', slug: 'tirumala-venkateswara-temple', stateId: 'andhra-pradesh' },
  { id: 'kashi-vishwanath-temple', name: 'Kashi Vishwanath Temple', location: 'Uttar Pradesh', image: 'assets/images/states/uttar-pradesh/kashi-vishwanath-temple.png', slug: 'kashi-vishwanath-temple', stateId: 'uttar-pradesh' },
  { id: 'hawa-mahal', name: 'Hawa Mahal', location: 'Rajasthan', image: 'assets/images/popular/hawa-mahal.png', slug: 'hawa-mahal', stateId: 'rajasthan' },
  { id: 'amber-fort', name: 'Amber Fort', location: 'Rajasthan', image: 'assets/images/popular/amber-fort.png', slug: 'amber-fort', stateId: 'rajasthan' },
  { id: 'mysore-palace', name: 'Mysore Palace', location: 'Karnataka', image: 'assets/images/popular/mysore-palace.png', slug: 'mysore-palace', stateId: 'karnataka' },
  { id: 'gateway-of-india', name: 'Gateway of India', location: 'Maharashtra', image: 'assets/images/popular/gateway-of-india.jpg', slug: 'gateway-of-india', stateId: 'maharashtra' },
  { id: 'charminar', name: 'Charminar', location: 'Telangana', image: 'assets/images/popular/charminar.jpg', slug: 'charminar', stateId: 'telangana' },
  { id: 'konark-sun-temple', name: 'Konark Sun Temple', location: 'Odisha', image: 'assets/images/popular/konark-sun-temple.jpg', slug: 'konark-sun-temple', stateId: 'odisha' },
  { id: 'hampi', name: 'Hampi', location: 'Karnataka', image: 'assets/images/popular/hampi.jpg', slug: 'hampi', stateId: 'karnataka' },
  { id: 'ajanta-caves', name: 'Ajanta Caves', location: 'Maharashtra', image: 'assets/images/popular/ajanta-caves.jpg', slug: 'ajanta-caves', stateId: 'maharashtra' },
  { id: 'ellora-caves', name: 'Ellora Caves', location: 'Maharashtra', image: 'assets/images/popular/ellora-caves.png', slug: 'ellora-caves', stateId: 'maharashtra' },
  { id: 'khajuraho-group-of-monuments', name: 'Khajuraho Group of Monuments', location: 'Madhya Pradesh', image: 'assets/images/states/madhya-pradesh/khajuraho-group-of-monuments.png', slug: 'khajuraho-group-of-monuments', stateId: 'madhya-pradesh' },
  { id: 'meenakshi-amman-temple', name: 'Meenakshi Amman Temple', location: 'Tamil Nadu', image: 'assets/images/popular/meenakshi-amman-temple.png', slug: 'meenakshi-amman-temple', stateId: 'tamil-nadu' },
  { id: 'mahabalipuram-monuments', name: 'Mahabalipuram Monuments', location: 'Tamil Nadu', image: 'assets/images/popular/mahabalipuram-monuments.png', slug: 'mahabalipuram-monuments', stateId: 'tamil-nadu' },
  { id: 'ramanathaswamy-temple', name: 'Ramanathaswamy Temple', location: 'Tamil Nadu', image: 'assets/images/popular/ramanathaswamy-temple.jpg', slug: 'ramanathaswamy-temple', stateId: 'tamil-nadu' },
  { id: 'jagannath-temple', name: 'Jagannath Temple', location: 'Odisha', image: 'assets/images/popular/jagannath-temple.jpg', slug: 'jagannath-temple', stateId: 'odisha' },
  { id: 'mahabodhi-temple', name: 'Mahabodhi Temple', location: 'Bihar', image: 'assets/images/popular/mahabodhi-temple.png', slug: 'mahabodhi-temple', stateId: 'bihar' },
  { id: 'dal-lake', name: 'Dal Lake', location: 'Jammu and Kashmir', image: 'assets/images/popular/dal-lake.jpg', slug: 'dal-lake', stateId: 'jammu-and-kashmir' },
  { id: 'pangong-lake', name: 'Pangong Lake', location: 'Ladakh', image: 'assets/images/popular/pangong-lake.png', slug: 'pangong-lake', stateId: 'ladakh' },
  { id: 'valley-of-flowers-national-park', name: 'Valley of Flowers National Park', location: 'Uttarakhand', image: 'assets/images/popular/valley-of-flowers.jpg', slug: 'valley-of-flowers-national-park', stateId: 'uttarakhand' },
  { id: 'kaziranga-national-park', name: 'Kaziranga National Park', location: 'Assam', image: "assets/images/popular/kaziranga-national-park.jpg", slug: 'kaziranga-national-park', stateId: 'assam' },
  { id: 'alleppey-backwaters', name: 'Alleppey Backwaters', location: 'Kerala', image: 'assets/images/popular/kerala-backwaters.jpg', slug: 'alleppey-backwaters', stateId: 'kerala' },
  { id: 'radhanagar-beach', name: 'Radhanagar Beach', location: 'Andaman and Nicobar Islands', image: 'assets/images/states/andaman-and-nicobar-islands/radhanagar-beach.png', slug: 'radhanagar-beach', stateId: 'andaman-and-nicobar-islands' },
  { id: 'statue-of-unity', name: 'Statue of Unity', location: 'Gujarat', image: 'assets/images/popular/statue-of-unity.png', slug: 'statue-of-unity', stateId: 'gujarat' },
  { id: 'agra-fort', name: 'Agra Fort', location: 'Uttar Pradesh', image: 'assets/images/popular/agra-fort.png', slug: 'agra-fort', stateId: 'uttar-pradesh' },
  { id: 'fatehpur-sikri', name: 'Fatehpur Sikri', location: 'Uttar Pradesh', image: 'assets/images/popular/fatehpur-sikri.jpg', slug: 'fatehpur-sikri', stateId: 'uttar-pradesh' },
  { id: 'mehrangarh-fort', name: 'Mehrangarh Fort', location: 'Rajasthan', image: 'assets/images/popular/mehrangarh-fort.jpg', slug: 'mehrangarh-fort', stateId: 'rajasthan' },
  { id: 'jaisalmer-fort', name: 'Jaisalmer Fort', location: 'Rajasthan', image: 'assets/images/popular/jaisalmer-fort.png', slug: 'jaisalmer-fort', stateId: 'rajasthan' },
  { id: 'city-palace-udaipur', name: 'City Palace Udaipur', location: 'Rajasthan', image: 'assets/images/states/rajasthan/city-palace-udaipur.png', slug: 'city-palace-udaipur', stateId: 'rajasthan' },
  { id: 'lake-pichola', name: 'Lake Pichola', location: 'Rajasthan', image: 'assets/images/states/rajasthan/lake-pichola.png', slug: 'lake-pichola', stateId: 'rajasthan' },
  { id: 'chittorgarh-fort', name: 'Chittorgarh Fort', location: 'Rajasthan', image: 'assets/images/popular/chittorgarh-fort.jpg', slug: 'chittorgarh-fort', stateId: 'rajasthan' },
  { id: 'somnath-temple', name: 'Somnath Temple', location: 'Gujarat', image: 'assets/images/popular/somnath-temple.jpg', slug: 'somnath-temple', stateId: 'gujarat' },
  { id: 'dwarkadhish-temple', name: 'Dwarkadhish Temple', location: 'Gujarat', image: 'assets/images/states/gujarat/dwarkadhish-temple.png', slug: 'dwarkadhish-temple', stateId: 'gujarat' },
  { id: 'kedarnath-temple', name: 'Kedarnath Temple', location: 'Uttarakhand', image: 'assets/images/popular/kedarnath-temple.jpg', slug: 'kedarnath-temple', stateId: 'uttarakhand' },
  { id: 'badrinath-temple', name: 'Badrinath Temple', location: 'Uttarakhand', image: 'assets/images/popular/badrinath-temple.jpg', slug: 'badrinath-temple', stateId: 'uttarakhand' },
  { id: 'sarnath', name: 'Sarnath', location: 'Uttar Pradesh', image: 'assets/images/popular/sarnath.png', slug: 'sarnath', stateId: 'uttar-pradesh' },
  { id: 'ramappa-temple', name: 'Ramappa Temple', location: 'Telangana', image: 'assets/images/states/telangana/ramappa-temple.png', slug: 'ramappa-temple', stateId: 'telangana' },
  { id: 'brihadeeswarar-temple', name: 'Brihadeeswarar Temple', location: 'Tamil Nadu', image: 'assets/images/popular/brihadeeswarar-temple.jpg', slug: 'brihadeeswarar-temple', stateId: 'tamil-nadu' },
  { id: 'jog-falls', name: 'Jog Falls', location: 'Karnataka', image: 'assets/images/popular/jog-falls.jpg', slug: 'jog-falls', stateId: 'karnataka' },
  { id: 'coorg', name: 'Coorg', location: 'Karnataka', image: 'assets/images/popular/coorg.png', slug: 'coorg', stateId: 'karnataka' },
  { id: 'ooty-lake', name: 'Ooty Lake', location: 'Tamil Nadu', image: 'assets/images/popular/ooty-lake.jpg', slug: 'ooty-lake', stateId: 'tamil-nadu' },
  { id: 'doddabetta-peak', name: 'Doddabetta Peak', location: 'Tamil Nadu', image: 'assets/images/popular/doddabetta-peak.png', slug: 'doddabetta-peak', stateId: 'tamil-nadu' },
  { id: 'kodaikanal-lake', name: 'Kodaikanal Lake', location: 'Tamil Nadu', image: 'assets/images/popular/kodaikanal.jpg', slug: 'kodaikanal-lake', stateId: 'tamil-nadu' },
  { id: 'munnar-tea-gardens', name: 'Munnar Tea Gardens', location: 'Kerala', image: 'assets/images/states/kerala/munnar-tea-gardens.png', slug: 'munnar-tea-gardens', stateId: 'kerala' },
  { id: 'periyar-national-park', name: 'Periyar National Park', location: 'Kerala', image: 'assets/images/popular/periyar-national-park.jpg', slug: 'periyar-national-park', stateId: 'kerala' },
  { id: 'gulmarg-gondola', name: 'Gulmarg Gondola', location: 'Jammu and Kashmir', image: 'assets/images/states/jammu-and-kashmir/gulmarg-gondola.png', slug: 'gulmarg-gondola', stateId: 'jammu-and-kashmir' },
  { id: 'nubra-valley', name: 'Nubra Valley', location: 'Ladakh', image: 'assets/images/popular/nubra-valley.png', slug: 'nubra-valley', stateId: 'ladakh' },
  { id: 'living-root-bridges', name: 'Living Root Bridges', location: 'Meghalaya', image: 'assets/images/popular/living-root-bridges.jpg', slug: 'living-root-bridges', stateId: 'meghalaya' },
  { id: 'nohkalikai-falls', name: 'Nohkalikai Falls', location: 'Meghalaya', image: 'assets/images/states/meghalaya/nohkalikai-falls.png', slug: 'nohkalikai-falls', stateId: 'meghalaya' },
  { id: 'tawang-monastery', name: 'Tawang Monastery', location: 'Arunachal Pradesh', image: "assets/images/popular/tawang-monastery.png", slug: 'tawang-monastery', stateId: 'arunachal-pradesh' },
  { id: 'sanchi-stupa', name: 'Sanchi Stupa', location: 'Madhya Pradesh', image: 'assets/images/popular/sanchi-stupa.jpg', slug: 'sanchi-stupa', stateId: 'madhya-pradesh' },
  { id: 'bhimbetka-rock-shelters', name: 'Bhimbetka Rock Shelters', location: 'Madhya Pradesh', image: 'assets/images/states/madhya-pradesh/bhimbetka-rock-shelters.png', slug: 'bhimbetka-rock-shelters', stateId: 'madhya-pradesh' },
  { id: 'kanha-national-park', name: 'Kanha National Park', location: 'Madhya Pradesh', image: 'assets/images/popular/kanha-national-park.png', slug: 'kanha-national-park', stateId: 'madhya-pradesh' },
  { id: 'bandhavgarh-national-park', name: 'Bandhavgarh National Park', location: 'Madhya Pradesh', image: 'assets/images/popular/bandhavgarh-national-park.jpg', slug: 'bandhavgarh-national-park', stateId: 'madhya-pradesh' },
  { id: 'araku-valley', name: 'Araku Valley', location: 'Andhra Pradesh', image: 'assets/images/popular/araku-valley.jpg', slug: 'araku-valley', stateId: 'andhra-pradesh' },
  { id: 'borra-caves', name: 'Borra Caves', location: 'Andhra Pradesh', image: 'assets/images/states/andhra-pradesh/borra-caves.jpg', slug: 'borra-caves', stateId: 'andhra-pradesh' },
  { id: 'srisailam-temple', name: 'Srisailam Temple', location: 'Andhra Pradesh', image: 'assets/images/states/andhra-pradesh/srisailam-temple.jpg', slug: 'srisailam-temple', stateId: 'andhra-pradesh' },
  { id: 'rushikonda-beach', name: 'Rushikonda Beach', location: 'Andhra Pradesh', image: 'assets/images/popular/rushikonda-beach.jpg', slug: 'rushikonda-beach', stateId: 'andhra-pradesh' },
  { id: 'golconda-fort', name: 'Golconda Fort', location: 'Telangana', image: 'assets/images/popular/golconda-fort.png', slug: 'golconda-fort', stateId: 'telangana' },
  { id: 'bhadrachalam-temple', name: 'Bhadrachalam Temple', location: 'Telangana', image: 'assets/images/states/telangana/bhadrachalam.png', slug: 'bhadrachalam-temple', stateId: 'telangana' },
  { id: 'chilika-lake', name: 'Chilika Lake', location: 'Odisha', image: 'assets/images/popular/chilika-lake.png', slug: 'chilika-lake', stateId: 'odisha' },
  { id: 'lingaraja-temple', name: 'Lingaraja Temple', location: 'Odisha', image: 'assets/images/popular/lingaraja-temple.png', slug: 'lingaraja-temple', stateId: 'odisha' },
  { id: 'puri-beach', name: 'Puri Beach', location: 'Odisha', image: 'assets/images/popular/puri-beach.png', slug: 'puri-beach', stateId: 'odisha' },
  { id: 'nalanda-mahavihara', name: 'Nalanda Mahavihara', location: 'Bihar', image: 'assets/images/states/bihar/nalanda-university-ruins.png', slug: 'nalanda-mahavihara', stateId: 'bihar' },
  { id: 'rajgir-ropeway', name: 'Rajgir Ropeway', location: 'Bihar', image: 'assets/images/states/bihar/rajgir.png', slug: 'rajgir-ropeway', stateId: 'bihar' },
  { id: 'sundarbans-national-park', name: 'Sundarbans National Park', location: 'West Bengal', image: 'assets/images/states/west-bengal/sundarbans-national-park.png', slug: 'sundarbans-national-park', stateId: 'west-bengal' },
  { id: 'darjeeling-himalayan-railway', name: 'Darjeeling Himalayan Railway', location: 'West Bengal', image: 'assets/images/states/west-bengal/darjeeling-himalayan-railway.png', slug: 'darjeeling-himalayan-railway', stateId: 'west-bengal' },
  { id: 'tiger-hill', name: 'Tiger Hill', location: 'West Bengal', image: 'assets/images/popular/tiger-hill.png', slug: 'tiger-hill', stateId: 'west-bengal' },
  { id: 'kalimpong-monasteries', name: 'Kalimpong Monasteries', location: 'West Bengal', image: 'assets/images/popular/kalimpong.png', slug: 'kalimpong-monasteries', stateId: 'west-bengal' },
  { id: 'majuli-river-island', name: 'Majuli River Island', location: 'Assam', image: 'assets/images/popular/majuli-island.jpg', slug: 'majuli-river-island', stateId: 'assam' },
  { id: 'kamakhya-temple', name: 'Kamakhya Temple', location: 'Assam', image: "assets/images/states/assam/kamakhya-temple.png", slug: 'kamakhya-temple', stateId: 'assam' },
  { id: 'dawki-river', name: 'Dawki River', location: 'Meghalaya', image: 'assets/images/popular/dawki-river.png', slug: 'dawki-river', stateId: 'meghalaya' },
  { id: 'ziro-valley', name: 'Ziro Valley', location: 'Arunachal Pradesh', image: "assets/images/popular/ziro-valley.jpg", slug: 'ziro-valley', stateId: 'arunachal-pradesh' },
  { id: 'tsomgo-lake', name: 'Tsomgo Lake', location: 'Sikkim', image: 'assets/images/popular/tsomgo-lake.jpg', slug: 'tsomgo-lake', stateId: 'sikkim' },
  { id: 'nathula-pass', name: 'Nathula Pass', location: 'Sikkim', image: 'assets/images/popular/nathula-pass.jpg', slug: 'nathula-pass', stateId: 'sikkim' },
  { id: 'gurudongmar-lake', name: 'Gurudongmar Lake', location: 'Sikkim', image: 'assets/images/states/sikkim/gurudongmar-lake.png', slug: 'gurudongmar-lake', stateId: 'sikkim' },
  { id: 'auli-ski-resort', name: 'Auli Ski Resort', location: 'Uttarakhand', image: 'assets/images/states/uttarakhand/auli.png', slug: 'auli-ski-resort', stateId: 'uttarakhand' },
  { id: 'naini-lake', name: 'Naini Lake', location: 'Uttarakhand', image: 'assets/images/states/uttarakhand/naini-lake.png', slug: 'naini-lake', stateId: 'uttarakhand' },
  { id: 'rohtang-pass', name: 'Rohtang Pass', location: 'Himachal Pradesh', image: 'assets/images/popular/rohtang-pass.png', slug: 'rohtang-pass', stateId: 'himachal-pradesh' },
  { id: 'solang-valley', name: 'Solang Valley', location: 'Himachal Pradesh', image: 'assets/images/states/himachal-pradesh/solang-valley.png', slug: 'solang-valley', stateId: 'himachal-pradesh' },
  { id: 'khajjiar', name: 'Khajjiar', location: 'Himachal Pradesh', image: 'assets/images/states/himachal-pradesh/khajjiar.png', slug: 'khajjiar', stateId: 'himachal-pradesh' },
  { id: 'pahalgam-valley', name: 'Pahalgam Valley', location: 'Jammu and Kashmir', image: 'assets/images/popular/pahalgam-valley.png', slug: 'pahalgam-valley', stateId: 'jammu-and-kashmir' },
  { id: 'sonamarg', name: 'Sonamarg', location: 'Jammu and Kashmir', image: 'assets/images/popular/sonamarg.png', slug: 'sonamarg', stateId: 'jammu-and-kashmir' },
  { id: 'magnetic-hill', name: 'Magnetic Hill', location: 'Ladakh', image: 'assets/images/states/ladakh/magnetic-hill.png', slug: 'magnetic-hill', stateId: 'ladakh' },
  { id: 'sam-sand-dunes', name: 'Sam Sand Dunes', location: 'Rajasthan', image: 'assets/images/states/rajasthan/sam-sand-dunes.png', slug: 'sam-sand-dunes', stateId: 'rajasthan' },
  { id: 'pushkar-lake', name: 'Pushkar Lake', location: 'Rajasthan', image: 'assets/images/popular/pushkar-lake.jpg', slug: 'pushkar-lake', stateId: 'rajasthan' },
  { id: 'shirdi-sai-baba-temple', name: 'Shirdi Sai Baba Temple', location: 'Maharashtra', image: 'assets/images/popular/shirdi-sai-baba-temple.png', slug: 'shirdi-sai-baba-temple', stateId: 'maharashtra' },
  { id: 'elephanta-caves', name: 'Elephanta Caves', location: 'Maharashtra', image: 'assets/images/popular/elephanta-caves.jpg', slug: 'elephanta-caves', stateId: 'maharashtra' },
  { id: 'mahabaleshwar-viewpoints', name: 'Mahabaleshwar Viewpoints', location: 'Maharashtra', image: 'assets/images/states/maharashtra/mahabaleshwar.png', slug: 'mahabaleshwar-viewpoints', stateId: 'maharashtra' },
  { id: 'belur-chennakeshava-temple', name: 'Belur Chennakeshava Temple', location: 'Karnataka', image: 'assets/images/states/karnataka/chennakeshava-temple-belur.png', slug: 'belur-chennakeshava-temple', stateId: 'karnataka' },
  { id: 'halebidu-hoysaleswara-temple', name: 'Halebidu Hoysaleswara Temple', location: 'Karnataka', image: 'assets/images/states/karnataka/hoysaleswara-temple-halebidu.png', slug: 'halebidu-hoysaleswara-temple', stateId: 'karnataka' },
  { id: 'badami-cave-temples', name: 'Badami Cave Temples', location: 'Karnataka', image: 'assets/images/popular/badami-cave-temples.jpg', slug: 'badami-cave-temples', stateId: 'karnataka' },
  { id: 'kanyakumari-beach', name: 'Kanyakumari Beach', location: 'Tamil Nadu', image: 'assets/images/popular/kanyakumari-beach.jpg', slug: 'kanyakumari-beach', stateId: 'tamil-nadu' },
  { id: 'marina-beach', name: 'Marina Beach', location: 'Tamil Nadu', image: 'assets/images/popular/marina-beach.jpg', slug: 'marina-beach', stateId: 'tamil-nadu' },
  { id: 'varkala-beach', name: 'Varkala Beach', location: 'Kerala', image: 'assets/images/popular/varkala-cliff.jpg', slug: 'varkala-beach', stateId: 'kerala' },
  { id: 'havelock-island', name: 'Havelock Island', location: 'Andaman and Nicobar Islands', image: 'assets/images/states/andaman-and-nicobar-islands/swaraj-dweep.png', slug: 'havelock-island', stateId: 'andaman-and-nicobar-islands' },
  { id: 'cellular-jail', name: 'Cellular Jail', location: 'Andaman and Nicobar Islands', image: 'assets/images/states/andaman-and-nicobar-islands/cellular-jail.png', slug: 'cellular-jail', stateId: 'andaman-and-nicobar-islands' },
  { id: 'dholavira', name: 'Dholavira', location: 'Gujarat', image: 'assets/images/popular/dholavira.png', slug: 'dholavira', stateId: 'gujarat' },
];

let currentCategory = sessionStorage.getItem('home-current-category') || 'all';

// Auto-assign categories based on names/locations
ALL_DESTINATIONS.forEach(d => {
  const n = d.name.toLowerCase();
  const c = d.categories = ['all'];
  if (n.match(/fort|palace|mahal|gate|minar|tomb|memorial|caves|haveli|sikri|vav/)) c.push('heritage');
  if (n.match(/temple|ghat|balaji|stupa|devi|cave/)) c.push('temples');
  if (n.match(/park|sundarbans/)) c.push('wildlife', 'national-parks');
  if (n.match(/beach|cliff|marine/)) c.push('beaches');
  if (n.match(/hill|valley|pass|trek|marg|leh|shimla|manali|ooty|abu|darjeeling/)) c.push('hills');
  if (n.match(/fall/)) c.push('waterfalls');
  if (n.match(/lake|backwater/)) c.push('lakes');
  if (d.location === 'Rajasthan' || d.location === 'Gujarat') c.push('deserts');
  if (c.length === 1) c.push('nature'); // Base fallback
});

// Ensure min 4 items for tricky categories manually
const addCat = (id, cat) => { const d = ALL_DESTINATIONS.find(x => x.id === id); if(d && !d.categories.includes(cat)) d.categories.push(cat); };
addCat('goa-beaches', 'beaches'); addCat('varkala-cliff', 'beaches'); addCat('marine-drive', 'beaches'); addCat('kanyakumari-sunset', 'beaches');
addCat('jog-falls', 'waterfalls'); addCat('athirappilly-waterfalls', 'waterfalls'); addCat('dudhsagar-falls', 'waterfalls'); addCat('kerala-backwaters', 'waterfalls');
addCat('dal-lake', 'lakes'); addCat('pangong-lake', 'lakes'); addCat('chilika-lake', 'lakes'); addCat('loktak-lake', 'lakes');
addCat('jim-corbett-national-park', 'wildlife'); addCat('kaziranga-national-park', 'wildlife'); addCat('ranthambore-national-park', 'wildlife'); addCat('gir-national-park', 'wildlife');
addCat('jaisalmer-fort', 'deserts'); addCat('patwon-ki-haveli', 'deserts'); addCat('mount-abu', 'deserts'); addCat('rani-ki-vav', 'deserts');

function getFilteredDestinations() {
  return currentCategory === 'all' 
    ? ALL_DESTINATIONS 
    : ALL_DESTINATIONS.filter(d => d.categories && d.categories.includes(currentCategory));
}

const DESTINATIONS_PER_PAGE = 4;



/**
 * Build a premium destination card (full-image overlay)
 */
export function destinationCard(dest, from = 'home') {
  const safeImage = escapeHTML(dest.images?.main || dest.image || '');
  const safeName = escapeHTML(dest.name);
  const safeLocation = escapeHTML(dest.location);
  const safeId = encodeURIComponent(dest.slug || dest.id);
  const imageHTML = safeImage 
    ? `<img class="card__image" src="${safeImage}" alt="${safeName}" loading="lazy">`
    : `<div class="state-card__gradient" style="background: linear-gradient(135deg, #1a2332 0%, #0f2847 100%); width: 100%; height: 100%;"></div>`;

  return `
    <a class="card destination-card" href="place-detail.html#place=${safeId}" id="dest-card-${safeId}">
      <div class="card__image-wrap">
        ${imageHTML}
        <div class="card__image-overlay"></div>
        <div class="card__overlay-content">
          <h3 class="card__title">${safeName}</h3>
          <div class="destination-card__location">${safeLocation}</div>
          <span class="destination-card__cta">Explore <span>→</span></span>
        </div>
      </div>
    </a>
  `;
}


/**
 * Build a premium state card
 */
function stateCardPremium(state) {
  const image = STATE_IMAGES[state.slug] || '';
  const attractions = STATE_ATTRACTIONS[state.slug] || '';

  const imageHTML = image
    ? `<img class="card__image" src="${image}" alt="${state.name}" loading="lazy">`
    : `<div class="state-card__gradient" style="background: linear-gradient(135deg, #1a2332 0%, #0f2847 100%)"></div>`;

  return `
    <a class="card state-card" href="state-detail.html#state=${state.slug}" data-state-id="${state.slug}" id="state-card-${state.slug}">
      <div class="card__image-wrap">
        ${imageHTML}
        <div class="card__image-overlay--full"></div>
        <div class="card__overlay-content">
          <h3 class="card__title" style="color:white; font-size: var(--fs-lg);">${state.name}</h3>
          ${attractions ? `<div class="state-card__attractions">${attractions}</div>` : ''}
          <span class="state-card__cta">Explore <span>→</span></span>
        </div>
      </div>
    </a>
  `;
}


/**
 * Render the Popular Destinations grid with pagination
 */
function renderPopularGrid(page = 0) {
  const filteredDestinations = getFilteredDestinations();

  if (page === 'all') {
    const cardsHTML = filteredDestinations.map(d => destinationCard(d, 'home')).join('');
    return `
      <div class="popular-destinations-wrap" data-current-page="all">
        <div class="cards-grid cards-grid--4" id="popular-cards-grid">
          ${cardsHTML}
        </div>
      </div>
    `;
  }

  const start = page * DESTINATIONS_PER_PAGE;
  const end = start + DESTINATIONS_PER_PAGE;
  const pageItems = filteredDestinations.slice(start, end);
  const totalPages = Math.ceil(filteredDestinations.length / DESTINATIONS_PER_PAGE);

  const cardsHTML = pageItems.map(d => destinationCard(d, 'home')).join('');

  // Page indicator dots
  const dotsHTML = totalPages > 1 ? `
    <div class="popular-pagination__dots">
      ${Array.from({ length: totalPages }, (_, i) => `
        <span class="popular-pagination__dot ${i === page ? 'popular-pagination__dot--active' : ''}" data-page="${i}"></span>
      `).join('')}
    </div>
  ` : '';

  // Navigation buttons
  const prevDisabled = page === 0;
  const nextDisabled = page >= totalPages - 1;

  return `
    <div class="popular-destinations-wrap" data-current-page="${page}">
      <div class="cards-grid cards-grid--4" id="popular-cards-grid">
        ${cardsHTML}
      </div>
      <div class="popular-pagination" id="popular-pagination">
        <div class="popular-pagination__left">
          <span class="result-count">Showing <strong>${filteredDestinations.length === 0 ? 0 : start + 1}–${Math.min(end, filteredDestinations.length)}</strong> of <strong>${filteredDestinations.length}</strong> destinations</span>
        </div>
        <div class="popular-pagination__controls">
          <button class="popular-pagination__btn ${prevDisabled ? 'popular-pagination__btn--disabled' : ''}" 
                  id="popular-prev" ${prevDisabled ? 'disabled' : ''} aria-label="Previous page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button class="popular-pagination__btn popular-pagination__btn--primary ${nextDisabled ? 'popular-pagination__btn--disabled' : ''}"
                  id="popular-next" ${nextDisabled ? 'disabled' : ''} aria-label="Next page">
            More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}


/**
 * Bind pagination click events
 */
function bindPaginationEvents() {
  const nextBtn = document.getElementById('popular-next');
  const prevBtn = document.getElementById('popular-prev');
  const dots = document.querySelectorAll('.popular-pagination__dot');
  const exploreBtn = document.getElementById('popular-explore-btn');

  function goToPage(page) {
    const section = document.getElementById('popular-section');
    const container = section?.querySelector('.popular-destinations-wrap')?.parentElement;
    if (!container) return;

    sessionStorage.setItem('home-popular-page', page);
    container.innerHTML = renderPopularGrid(page);

    // Fade in instantly
    const newWrap = container.querySelector('.popular-destinations-wrap');
    if (newWrap) {
      newWrap.style.animation = 'fadeIn 0.3s ease';
    }

    // Scroll to section
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Re-bind events
    bindPaginationEvents();
  }

  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      window.location.href = 'destinations.html';
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const wrap = document.querySelector('.popular-destinations-wrap');
      const currentPage = parseInt(wrap?.dataset.currentPage || '0');
      const totalPages = Math.ceil(getFilteredDestinations().length / DESTINATIONS_PER_PAGE);
      if (currentPage < totalPages - 1) {
        goToPage(currentPage + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const wrap = document.querySelector('.popular-destinations-wrap');
      const currentPage = parseInt(wrap?.dataset.currentPage || '0');
      if (currentPage > 0) {
        goToPage(currentPage - 1);
      }
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const page = parseInt(dot.dataset.page || '0');
      goToPage(page);
    });
  });
}


/**
 * Render the home landing page
 */
export function renderHomeFeed(data, container) {
  const { states } = data;

  // ━━━ HERO BANNER ━━━
  const heroHTML = `
    <section class="hero hero--banner" id="hero-section">
      <div class="hero__bg">
        <img src="assets/images/hero_banner.png" alt="Discover India with Travvana" loading="eager" decoding="async">
        <div class="hero__bg-overlay"></div>
      </div>
      <div class="hero__content container">
        <div class="hero__label" style="color: var(--clr-accent);">EXPLORE THE INCREDIBLE</div>
        <h1 class="hero__title">Discover India</h1>
        <p class="hero__subtitle">Curated places for your next adventure</p>
      </div>
    </section>
  `;

  // ━━━ UNIFIED SEARCH & CATEGORIES ━━━
  const searchHTML = `
    <div class="container" style="margin-top: var(--section-gap);">
      <div class="home-search" style="margin-bottom: var(--sp-6);">
        ${unifiedSearchBar({ 
          placeholder: 'Search by city, place or state', 
          id: 'hero-search',
          activeCategory: currentCategory
        })}
      </div>
    </div>
  `;

  // ━━━ POPULAR DESTINATIONS (4 per row × 2 rows = 8, paginated) ━━━
  const popularHTML = `
    <section class="section" id="popular-section">
      <div class="container">
        <div class="section-title-row">
          <div class="section-title-row__left">
            <h2>Popular Destinations</h2>
            <p class="section-subtitle">Top must visit places across India</p>
          </div>
          <button class="section-title-row__more" id="popular-explore-btn">Explore</button>
        </div>
        <div id="popular-grid-container">
          ${renderPopularGrid(parseInt(sessionStorage.getItem('home-popular-page') || '0', 10))}
        </div>
      </div>
    </section>
  `;

  // ━━━ STATES & UNION TERRITORIES (4 per row × 2 rows, paginated) ━━━
  // All 28 states sorted alphabetically + 8 UTs alphabetically at the end
  const statesList = [
    'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh',
    'goa', 'gujarat', 'haryana', 'himachal-pradesh', 'jharkhand',
    'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 'manipur',
    'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
    'rajasthan', 'sikkim', 'tamil-nadu', 'telangana', 'tripura',
    'uttar-pradesh', 'uttarakhand', 'west-bengal'
  ];
  const utList = [
    'andaman-and-nicobar-islands', 'chandigarh', 'dadra-nagar-haveli-daman-diu',
    'delhi', 'jammu-and-kashmir', 'ladakh', 'lakshadweep', 'puducherry'
  ];
  const ALL_STATES_UTS = [...statesList, ...utList];
  const STATES_PER_PAGE = 4;

  const allStates = states?.states || [];

  function buildStateCard(slug) {
    const stateData = allStates.find(s => s.slug === slug);
    if (!stateData) {
      return stateCardPremium({
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        slug
      });
    }
    return stateCardPremium(stateData);
  }

  function renderStatesPage(page = 0) {
    const start = page * STATES_PER_PAGE;
    const end = start + STATES_PER_PAGE;
    const pageItems = ALL_STATES_UTS.slice(start, end);
    const totalPages = Math.ceil(ALL_STATES_UTS.length / STATES_PER_PAGE);

    const cardsHTML = pageItems.map(slug => buildStateCard(slug)).join('');

    // Check if this page crosses from states into UTs
    const statesCount = statesList.length; // 28
    const showingStates = pageItems.some(s => statesList.includes(s));
    const showingUTs = pageItems.some(s => utList.includes(s));
    let label = '';
    if (showingStates && !showingUTs) label = 'States';
    else if (!showingStates && showingUTs) label = 'Union Territories';
    else if (showingStates && showingUTs) label = 'States & Union Territories';

    // Dots
    const dotsHTML = totalPages > 1 ? `
      <div class="popular-pagination__dots">
        ${Array.from({ length: totalPages }, (_, i) => `
          <span class="popular-pagination__dot ${i === page ? 'popular-pagination__dot--active' : ''}" data-spage="${i}"></span>
        `).join('')}
      </div>
    ` : '';

    const prevDisabled = page === 0;
    const nextDisabled = page >= totalPages - 1;

    return `
      <div class="states-destinations-wrap" data-current-page="${page}">
        <div class="cards-grid cards-grid--4" id="states-cards-grid">
          ${cardsHTML}
        </div>
        <div class="popular-pagination" id="states-pagination">
          <div class="popular-pagination__left">
            <span class="result-count">Showing <strong>${start + 1}–${Math.min(end, ALL_STATES_UTS.length)}</strong> of <strong>${ALL_STATES_UTS.length}</strong> ${label}</span>
          </div>
          <div class="popular-pagination__controls">
            <button class="popular-pagination__btn ${prevDisabled ? 'popular-pagination__btn--disabled' : ''}"
                    id="states-prev" ${prevDisabled ? 'disabled' : ''} aria-label="Previous page">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button class="popular-pagination__btn popular-pagination__btn--primary ${nextDisabled ? 'popular-pagination__btn--disabled' : ''}"
                    id="states-next" ${nextDisabled ? 'disabled' : ''} aria-label="Next page">
              More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const stateWiseHTML = `
    <section class="section" id="statewise-section">
      <div class="container">
        <div class="section-title-row">
          <div class="section-title-row__left">
            <h2>States & Union Territories</h2>
            <p class="section-subtitle">Explore all 28 states and 8 union territories of India</p>
          </div>
          <a href="discovery.html" class="section-title-row__more">Explore</a>
        </div>
        <div id="states-grid-container">
          ${renderStatesPage(parseInt(sessionStorage.getItem('home-states-page') || '0', 10))}
        </div>
      </div>
    </section>
  `;

  // ━━━ AI PLANNER BANNER ━━━
  const bannerHTML = `
    <section class="section">
      <div class="container">
        <div class="featured-banner">
          <div class="featured-banner__decoration"></div>
          <div class="featured-banner__content">
            <span class="featured-banner__label">Coming Soon</span>
            <h3 class="featured-banner__title">AI Trip Planner</h3>
            <p class="featured-banner__text">Tell us your interests, budget, and dates — our AI creates the perfect itinerary for you.</p>
            <button class="btn btn--ai btn--sm" style="
              background: var(--clr-accent-gradient);
              color: white;
              padding: 10px 24px;
              border-radius: var(--radius-full);
              font-weight: var(--fw-semibold);
              font-size: var(--fs-sm);
              border: none;
              cursor: pointer;
              transition: all 0.25s var(--ease-out);
              box-shadow: var(--clr-accent-glow);
            ">Get Early Access</button>
          </div>
        </div>
      </div>
    </section>
  `;

  // ━━━ ASSEMBLE ━━━
  const fullHTML = `
    ${heroHTML}
    ${searchHTML}
    ${popularHTML}
    ${stateWiseHTML}
    ${bannerHTML}
  `;

  setHTML(container, fullHTML, false);

  // Bind pagination after render
  requestAnimationFrame(() => {
    bindPaginationEvents();
    bindStatesPagination();
  });

  function handleCategoryChange(catId) {
    if (currentCategory === catId) return;

    currentCategory = catId || 'all';
    sessionStorage.setItem('home-current-category', currentCategory);
    sessionStorage.setItem('home-popular-page', '0');
    
    const gridContainer = document.getElementById('popular-grid-container');
    if (gridContainer) {
      gridContainer.innerHTML = renderPopularGrid(0);
      const newWrap = gridContainer.querySelector('.popular-destinations-wrap');
      if (newWrap) {
        newWrap.style.animation = 'fadeIn 0.3s ease';
      }
      bindPaginationEvents();
    }
  }

  // Export handleCategoryChange so discoveryController can use it with initUnifiedSearchBar
  container.handleCategoryChange = handleCategoryChange;



  // States/UT pagination handler
  function bindStatesPagination() {
    const nextBtn = document.getElementById('states-next');
    const prevBtn = document.getElementById('states-prev');
    const dots = document.querySelectorAll('[data-spage]');

    function goToStatePage(page) {
      const section = document.getElementById('statewise-section');
      const container = document.getElementById('states-grid-container');
      if (!container) return;

      sessionStorage.setItem('home-states-page', page);
      container.innerHTML = renderStatesPage(page);

      const newWrap = container.querySelector('.states-destinations-wrap');
      if (newWrap) {
        newWrap.style.animation = 'fadeIn 0.3s ease';
      }

      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      bindStatesPagination();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const wrap = document.querySelector('.states-destinations-wrap');
        const currentPage = parseInt(wrap?.dataset.currentPage || '0');
        const totalPages = Math.ceil(ALL_STATES_UTS.length / STATES_PER_PAGE);
        if (currentPage < totalPages - 1) goToStatePage(currentPage + 1);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const wrap = document.querySelector('.states-destinations-wrap');
        const currentPage = parseInt(wrap?.dataset.currentPage || '0');
        if (currentPage > 0) goToStatePage(currentPage - 1);
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const page = parseInt(dot.dataset.spage || '0');
        goToStatePage(page);
      });
    });
  }
}


/**
 * Render home page skeleton loading state
 */
export function renderHomeSkeletons(container) {
  const skeletonCard = `
    <div class="card destination-card" style="background: var(--clr-bg-card); overflow: hidden;">
      <div class="skeleton" style="width:100%; height:100%; border-radius: var(--card-radius);"></div>
    </div>
  `;

  setHTML(container, `
    <div style="margin-bottom: var(--sp-8);">
      <div class="skeleton" style="width:100%; aspect-ratio:21/8; margin-bottom:var(--sp-8);"></div>
    </div>
    <div class="container">
      <div class="skeleton" style="height:44px; border-radius:var(--chip-radius); margin-bottom:var(--sp-4); max-width:300px;"></div>
      <div style="display:flex; gap:var(--chip-gap); margin-bottom:var(--sp-6); overflow:hidden;">
        ${Array(8).fill('<div class="skeleton" style="width:100px; height:44px; border-radius:var(--chip-radius); flex-shrink:0;"></div>').join('')}
      </div>
      <div class="skeleton" style="height:48px; border-radius:var(--search-radius); margin-bottom:var(--section-gap);"></div>

      <div class="skeleton" style="width:250px; height:28px; margin-bottom:var(--sp-2);"></div>
      <div class="skeleton" style="width:300px; height:16px; margin-bottom:var(--sp-5);"></div>
      <div class="cards-grid cards-grid--4">
        ${Array(4).fill(skeletonCard).join('')}
      </div>
    </div>
  `, false);
}
