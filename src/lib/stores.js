// @ts-nocheck
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// ── Language ──────────────────────────────────────────
export const lang = writable(browser ? (localStorage.getItem('lang') || 'en') : 'en');
lang.subscribe(v => { if (browser) localStorage.setItem('lang', v); });

// ── Toast ─────────────────────────────────────────────
export const toast = writable(null); // { msg, type }
export function showToast(msg, type = 'success') {
  toast.set({ msg, type });
  setTimeout(() => toast.set(null), 3000);
}

// ── Auth ──────────────────────────────────────────────
export const adminAuth = writable(browser ? JSON.parse(localStorage.getItem('adminAuth') || 'null') : null);
adminAuth.subscribe(v => { if (browser) localStorage.setItem('adminAuth', JSON.stringify(v)); });

// ── Shelter Data ──────────────────────────────────────
const DEFAULT = [
  {
    id: 's1', name: 'Shri Ram Gaushala', nameGu: 'શ્રી રામ ગૌશાળા',
    address: 'Near Hanuman Mandir, Anand, Gujarat 388001', addressGu: 'હનુમાન મંદિર પાસે, આણંદ',
    phone: '+91 99999 11111', email: 'shriram.gaushala@gmail.com',
    lat: 22.5645, lng: 72.9289, city: 'Anand', established: '1985',
    capacity: 250, openHours: '6:00 AM – 8:00 PM', emoji: '🐄',
    description: 'One of the oldest gaushalas in Anand. Home to 200+ desi cows.',
    descriptionGu: 'આણંદ જિલ્લામાં સૌથી જૂની ગૌશાળા, 200+ દેશી ગાય.',
    admin: { username: 'shriram', password: 'gaushala123' },
    cows: [
      { id:'c1', name:'Kamdhenu', breed:'Gir', age:5, weight:420, color:'White & Brown', status:'healthy', notes:'Good milk yield' },
      { id:'c2', name:'Nandini',  breed:'Kankrej', age:3, weight:380, color:'White', status:'pregnant', notes:'Due in 2 months' },
      { id:'c3', name:'Gauri',    breed:'Sahiwal', age:7, weight:460, color:'Brown', status:'healthy', notes:'' },
      { id:'c4', name:'Radha',    breed:'Gir', age:2, weight:290, color:'Spotted', status:'new', notes:'Rescued from highway' }
    ],
    products: [
      { id:'p1', name:'Fresh Milk', nameGu:'તાજું દૂધ', price:55, unit:'per litre', unitGu:'પ્રતિ લિટર', emoji:'🥛', desc:'Pure A2 cow milk' },
      { id:'p2', name:'Desi Ghee',  nameGu:'દેશી ઘી',  price:850, unit:'per kg', unitGu:'પ્રતિ કિલો', emoji:'🧈', desc:'Bilona ghee' },
      { id:'p3', name:'Paneer',     nameGu:'પનીર',     price:320, unit:'per kg', unitGu:'પ્રતિ કિલો', emoji:'🧀', desc:'Fresh paneer' },
      { id:'p4', name:'Dung Cake',  nameGu:'ગોળો',     price:10,  unit:'each',   unitGu:'પ્રતિ નંગ',  emoji:'🫘', desc:'For havan & fuel' }
    ],
    services: [
      { id:'sv1', name:'Cow Adoption',       nameGu:'ગૌ-ધારણ',     icon:'❤️', desc:'Adopt a cow and earn blessings' },
      { id:'sv2', name:'Panchgavya Therapy', nameGu:'પંચગવ્ય',     icon:'🌿', desc:'Ayurvedic panchgavya treatments' },
      { id:'sv3', name:'School Visits',      nameGu:'શૈક્ષણિક ભ્રમણ', icon:'🏫', desc:'Educational field trips' }
    ],
    photos: []
  },
  {
    id: 's2', name: 'Gokul Dham Gaushala', nameGu: 'ગોકુળ ધામ ગૌશાળા',
    address: 'Opp. Bus Stand, Nadiad, Gujarat 387001', addressGu: 'બસ સ્ટૅન્ડ સામે, નડિયાદ',
    phone: '+91 98765 22222', email: 'gokuldham@gmail.com',
    lat: 22.6939, lng: 72.8623, city: 'Nadiad', established: '2001',
    capacity: 180, openHours: '5:30 AM – 9:00 PM', emoji: '🐮',
    description: 'Modern facility dedicated to stray and injured cows.',
    descriptionGu: 'ભટકતી ગાયો માટે આધુનિક ગૌશાળા.',
    admin: { username: 'gokul', password: 'dham2001' },
    cows: [
      { id:'c1', name:'Lakshmi', breed:'Gir',     age:4, weight:400, color:'Golden', status:'healthy', notes:'' },
      { id:'c2', name:'Paro',    breed:'Kankrej', age:6, weight:430, color:'Grey',   status:'sick',    notes:'Under treatment – fever' }
    ],
    products: [
      { id:'p1', name:'A2 Milk',  nameGu:'A2 દૂધ', price:65, unit:'per litre', unitGu:'પ્રતિ લિટર', emoji:'🥛', desc:'Premium A2 milk' },
      { id:'p2', name:'Dahi',     nameGu:'દહીં',   price:60, unit:'500g',      unitGu:'500g',        emoji:'🫙', desc:'Thick set curd' },
      { id:'p3', name:'Gomutra',  nameGu:'ગોમૂત્ર',price:20, unit:'250ml',    unitGu:'250ml',        emoji:'💛', desc:'Purified arkam' }
    ],
    services: [
      { id:'sv1', name:'Vet Care',          nameGu:'પશુ ચિકિત્સા', icon:'🏥', desc:'Free vet care' },
      { id:'sv2', name:'Cow Sponsorship',   nameGu:'ગૌ-સ્પૉન્સ',  icon:'🫶', desc:'Sponsor daily feed' }
    ],
    photos: []
  },
  {
    id: 's3', name: 'Mahavir Gaushala', nameGu: 'મહાવીર ગૌશાળા',
    address: 'Village Sojitra, Kheda, Gujarat 387240', addressGu: 'ગામ સોજિત્રા, ખેડા',
    phone: '+91 97654 33333', email: 'mahavir.gaushala@gmail.com',
    lat: 22.5850, lng: 72.7910, city: 'Kheda', established: '1972',
    capacity: 350, openHours: '24×7', emoji: '🐄',
    description: 'Largest gaushala in Kheda district, running since 1972.',
    descriptionGu: 'ખેડા જિલ્લાની સૌથી મોટી ગૌશાળા, 1972 થી.',
    admin: { username: 'mahavir', password: 'kheda1972' },
    cows: [
      { id:'c1', name:'Shyama', breed:'Sahiwal', age:8, weight:500, color:'Dark Brown',  status:'healthy',  notes:'' },
      { id:'c2', name:'Gori',   breed:'Gir',     age:3, weight:350, color:'White',       status:'healthy',  notes:'' },
      { id:'c3', name:'Tulsi',  breed:'Kankrej', age:5, weight:420, color:'White & Grey',status:'pregnant', notes:'First pregnancy' }
    ],
    products: [
      { id:'p1', name:'Bilona Ghee',   nameGu:'બિલોણ ઘી', price:1100, unit:'per kg',  unitGu:'પ્રતિ કિલો', emoji:'🧈', desc:'Traditional ghee' },
      { id:'p2', name:'Cow Milk',      nameGu:'ગાયનું દૂધ',price:50,   unit:'per litre',unitGu:'પ્રતિ લિટર', emoji:'🥛', desc:'Fresh morning milk' },
      { id:'p3', name:'Vermicompost',  nameGu:'ખાતર',      price:25,   unit:'per kg',  unitGu:'પ્રતિ કિલો', emoji:'🌱', desc:'Organic compost' },
      { id:'p4', name:'Panchgavya Soap',nameGu:'પંચગવ્ય સાબુ',price:80, unit:'per bar',unitGu:'પ્રતિ નંગ', emoji:'🧼', desc:'Herbal soap' }
    ],
    services: [
      { id:'sv1', name:'Donation Drive',   nameGu:'દાન અભિયાન', icon:'🙏', desc:'Donate fodder or funds' },
      { id:'sv2', name:'Organic Farming',  nameGu:'ઓર્ગેનિક ખેતી',icon:'🌾', desc:'Cow-based natural farming' },
      { id:'sv3', name:'Cultural Events',  nameGu:'સાંસ્કૃતિક',  icon:'🎉', desc:'Govardhan Puja events' }
    ],
    photos: []
  }
];

function load() {
  if (!browser) return DEFAULT;
  const s = localStorage.getItem('gaushalas');
  if (!s) { save(DEFAULT); return DEFAULT; }
  return JSON.parse(s);
}
function save(d) { if (browser) localStorage.setItem('gaushalas', JSON.stringify(d)); }

export const shelters = writable(load());
shelters.subscribe(v => save(v));

export function getShelter(id) {
  let s; shelters.subscribe(all => { s = all.find(x => x.id === id); })();
  return s;
}
export function updateShelter(updated) {
  shelters.update(all => all.map(s => s.id === updated.id ? updated : s));
}
export function uid() { return 'id_' + Math.random().toString(36).substr(2,9); }
export function distKm(lat1,lon1,lat2,lon2) {
  const R=6371, dL=(lat2-lat1)*Math.PI/180, dl=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dL/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dl/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
