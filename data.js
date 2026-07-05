// ============================
// DEMO DATA STORE (localStorage backed)
// ============================

const DEFAULT_SHELTERS = [
  {
    id: "s1",
    name: "Shri Ram Gaushala",
    nameGu: "શ્રી રામ ગૌશાળા",
    address: "Near Hanuman Mandir, Anand, Gujarat 388001",
    addressGu: "હનુમાન મંદિર પાસે, આણંદ, ગુજરાત",
    phone: "+91 99999 11111",
    email: "shriram.gaushala@gmail.com",
    lat: 22.5645, lng: 72.9289,
    city: "Anand",
    established: "1985",
    capacity: 250,
    openHours: "6:00 AM – 8:00 PM",
    description: "One of the oldest and most respected gaushalas in Anand district, home to desi breeds.",
    descriptionGu: "આણંદ જિલ્લામાં સૌથી જૂની ગૌશાળા, દેશી ઓલાદ ઘર.",
    emoji: "🐄",
    cows: [],
    products: [
      { id: "p1", name: "Fresh Milk", nameGu: "તાજું દૂધ", price: 55, unit: "per litre", unitGu: "પ્રતિ લિટર", emoji: "🥛", description: "Pure A2 cow milk" },
      { id: "p2", name: "Desi Ghee", nameGu: "દેશી ઘી", price: 850, unit: "per kg", unitGu: "પ્રતિ કિલો", emoji: "🧈", description: "Hand-churned bilona ghee" },
      { id: "p3", name: "Paneer", nameGu: "પનીર", price: 320, unit: "per kg", unitGu: "પ્રતિ કિલો", emoji: "🧀", description: "Fresh homemade paneer" },
      { id: "p4", name: "Cow Dung Cake", nameGu: "ગોળો", price: 10, unit: "per piece", unitGu: "પ્રતિ નંગ", emoji: "🫘", description: "Dried dung cake for havan & fuel" },
    ],
    services: [
      { id: "sv1", name: "Cow Adoption", nameGu: "ગૌ-ધારણ", icon: "❤️", description: "Adopt a cow and earn her blessings" },
      { id: "sv2", name: "Panchgavya Therapy", nameGu: "પંચગવ્ય", icon: "🌿", description: "Ayurvedic treatments using panchgavya" },
      { id: "sv3", name: "School Visits", nameGu: "શૈક્ષણિક ભ્રમણ", icon: "🏫", description: "Educational field trips for students" },
    ],
    photos: [],
    admin: { username: "shriram", password: "gaushala123" }
  },
  {
    id: "s2",
    name: "Gokul Dham Gaushala",
    nameGu: "ગોકુળ ધામ ગૌશાળા",
    address: "Opp. Bus Stand, Nadiad, Gujarat 387001",
    addressGu: "બસ સ્ટૅન્ડ સામે, નડિયાદ, ગુજરાત",
    phone: "+91 98765 22222",
    email: "gokuldham@gmail.com",
    lat: 22.6939, lng: 72.8623,
    city: "Nadiad",
    established: "2001",
    capacity: 180,
    openHours: "5:30 AM – 9:00 PM",
    description: "Gokul Dham is dedicated to caring for stray and injured cows with modern facilities.",
    descriptionGu: "ગોકુળ ધામ ભટકતી અને ઘાયલ ગાયોની સંભાળ માટે સમર્પિત.",
    emoji: "🐮",
    cows: [],
    products: [
      { id: "p1", name: "A2 Milk", nameGu: "A2 દૂધ", price: 65, unit: "per litre", unitGu: "પ્રતિ લિટર", emoji: "🥛", description: "Premium A2 protein milk" },
      { id: "p2", name: "Curd (Dahi)", nameGu: "દહીં", price: 60, unit: "500g", unitGu: "500g", emoji: "🫙", description: "Thick set curd" },
      { id: "p3", name: "Cow Urine (Gomutra)", nameGu: "ગોમૂત્ર", price: 20, unit: "per 250ml", unitGu: "250ml", emoji: "💛", description: "Purified gomutra arkam" },
    ],
    services: [
      { id: "sv1", name: "Vet Care", nameGu: "પશુ ચિકિત્સા", icon: "🏥", description: "Free veterinary care for injured cows" },
      { id: "sv2", name: "Cow Sponsorship", nameGu: "ગૌ-સ્પૉન્સ", icon: "🫶", description: "Sponsor daily feed for a cow" },
    ],
    photos: [],
    admin: { username: "gokul", password: "dham2001" }
  },
  {
    id: "s3",
    name: "Mahavir Gaushala",
    nameGu: "મહાવીર ગૌશાળા",
    address: "Village Sojitra, Kheda, Gujarat 387240",
    addressGu: "ગામ સોજિત્રા, ખેડા, ગુજરાત",
    phone: "+91 97654 33333",
    email: "mahavir.gaushala@gmail.com",
    lat: 22.5850, lng: 72.7910,
    city: "Kheda",
    established: "1972",
    capacity: 350,
    openHours: "All Day (24×7)",
    description: "The largest gaushala in Kheda district, running since 1972 with over 300 cows.",
    descriptionGu: "ખેડા જિલ્લાની સૌથી મોટી ગૌશાળા, 1972 થી 300+ ગાયો સાથે.",
    emoji: "🐄",
    cows: [],
    products: [
      { id: "p1", name: "Bilona Ghee", nameGu: "બિલોણ ઘી", price: 1100, unit: "per kg", unitGu: "પ્રતિ કિલો", emoji: "🧈", description: "Traditional bilona ghee" },
      { id: "p2", name: "Cow Milk", nameGu: "ગાયનું દૂધ", price: 50, unit: "per litre", unitGu: "પ્રતિ લિટર", emoji: "🥛", description: "Fresh morning milk" },
      { id: "p3", name: "Vermi Compost", nameGu: "ખાતર", price: 25, unit: "per kg", unitGu: "પ્રતિ કિલો", emoji: "🌱", description: "Organic vermicompost from cow dung" },
      { id: "p4", name: "Panchgavya Soap", nameGu: "પંચગવ્ય સાબુ", price: 80, unit: "per bar", unitGu: "પ્રતિ નંગ", emoji: "🧼", description: "Handmade herbal soap" },
    ],
    services: [
      { id: "sv1", name: "Donation Drive", nameGu: "દાન અભિયાન", icon: "🙏", description: "Donate fodder, funds or time" },
      { id: "sv2", name: "Organic Farming", nameGu: "ઓર્ગેનિક ખેતી", icon: "🌾", description: "Cow dung & urine for natural farming" },
      { id: "sv3", name: "Cultural Events", nameGu: "સાંસ્કૃતિક", icon: "🎉", description: "Govardhan Puja & Gopashtami events" },
    ],
    photos: [],
    admin: { username: "mahavir", password: "kheda1972" }
  }
];

// Initialise default cows for demo
DEFAULT_SHELTERS[0].cows = [
  { id: "c1", name: "Kamdhenu", breed: "Gir", age: 5, weight: 420, color: "White & Brown", status: "healthy", notes: "Good milk yield" },
  { id: "c2", name: "Nandini", breed: "Kankrej", age: 3, weight: 380, color: "White", status: "pregnant", notes: "Due in 2 months" },
  { id: "c3", name: "Gauri", breed: "Sahiwal", age: 7, weight: 460, color: "Brown", status: "healthy", notes: "" },
  { id: "c4", name: "Radha", breed: "Gir", age: 2, weight: 290, color: "Spotted", status: "new", notes: "Rescued from highway" },
];
DEFAULT_SHELTERS[1].cows = [
  { id: "c1", name: "Lakshmi", breed: "Gir", age: 4, weight: 400, color: "Golden", status: "healthy", notes: "" },
  { id: "c2", name: "Paro", breed: "Kankrej", age: 6, weight: 430, color: "Grey", status: "sick", notes: "Under treatment – fever" },
];
DEFAULT_SHELTERS[2].cows = [
  { id: "c1", name: "Shyama", breed: "Sahiwal", age: 8, weight: 500, color: "Dark Brown", status: "healthy", notes: "" },
  { id: "c2", name: "Gori", breed: "Gir", age: 3, weight: 350, color: "White", status: "healthy", notes: "" },
  { id: "c3", name: "Tulsi", breed: "Kankrej", age: 5, weight: 420, color: "White & Grey", status: "pregnant", notes: "First pregnancy" },
];

function loadShelters() {
  const stored = localStorage.getItem('gaushalas');
  if (!stored) {
    saveShelters(DEFAULT_SHELTERS);
    return DEFAULT_SHELTERS;
  }
  return JSON.parse(stored);
}

function saveShelters(data) {
  localStorage.setItem('gaushalas', JSON.stringify(data));
}

function getShelter(id) {
  return loadShelters().find(s => s.id === id);
}

function updateShelter(updated) {
  const all = loadShelters();
  const idx = all.findIndex(s => s.id === updated.id);
  if (idx !== -1) all[idx] = updated;
  saveShelters(all);
}

function uid() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Haversine distance in km
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
