export type Group = 'SaaS & Apps' | 'Immersive & WebAR' | 'Brand & Corporate';

/** What fills the large visual of a featured project. */
export type FeaturedMedia =
  | { kind: 'svg'; motif: 'geofence' }
  | { kind: 'model'; src: string; poster: string; alt: string; credit: string }
  | { kind: 'panorama'; src: string; srcSmall: string; credit: string; startYaw?: number };

export interface FeaturedProject {
  name: string;
  sector: string;
  summary: string;
  stack: string[];
  url: string;
  group: Group;
  media: FeaturedMedia;
}

export interface ArchiveProject {
  name: string;
  sector: string;
  stack: string;
  url?: string;
  group: Group;
}

/** Highlighted in "Selected Work". */
export const featured: FeaturedProject[] = [
  {
    name: 'VineWine Platform',
    sector: 'SaaS · Precision Agriculture',
    summary:
      'Precision-agriculture platform with geofenced vineyard parcels, spatial analysis and data dashboards for growers.',
    stack: ['Nuxt 3', 'Pinia', 'Leaflet', 'Turf.js', 'Chart.js'],
    url: 'https://vinewineplatform.com',
    group: 'SaaS & Apps',
    media: { kind: 'svg', motif: 'geofence' },
  },
  {
    name: 'VizitAR',
    sector: 'Tourism SaaS · WebAR',
    summary:
      'Tourism SaaS and interactive WebAR hub — museum pieces, monuments and 3D scenes you can orbit in the browser or place in your own space.',
    stack: ['Vue.js', 'Nuxt.js', '3D Loaders', 'WebAR'],
    url: 'https://vizitar.com/',
    group: 'Immersive & WebAR',
    media: {
      kind: 'model',
      src: '/models/cosmic-buddha.glb',
      poster: '/models/cosmic-buddha-poster.jpg',
      alt: 'Laser scan of the "Cosmic Buddha", a 6th-century carved limestone statue from China',
      credit: '"Cosmic Buddha" scan: Smithsonian NMAA · CC0',
    },
  },
  {
    name: 'Virtual Aveiro',
    sector: 'Digital Twin · Virtual Tour',
    summary:
      'A digital twin of the city of Aveiro — an immersive 360° virtual tour along its waterfront, canals and landmarks.',
    stack: ['Nuxt.js', '360° Media Player', 'Geospatial'],
    url: 'https://aveiro.virtual.vizitar.com',
    group: 'Immersive & WebAR',
    media: {
      kind: 'panorama',
      src: '/panoramas/waterfront-4k.jpg',
      srcSmall: '/panoramas/waterfront-2k.jpg',
      credit: 'Demo panorama: Greg Zaal / Poly Haven · CC0',
      startYaw: 0.63,
    },
  },
];

/** Everything else, shown in the project index. */
export const archive: ArchiveProject[] = [
  { name: 'SaaS Site Builder', sector: 'Page & layout builder engine', stack: 'Vue.js, Filament PHP', group: 'SaaS & Apps' },
  { name: 'Blip Delivery Manager', sector: 'Logistics portal', stack: 'Custom WordPress, ACF Pro', url: 'https://www.blip.deliverymanager.pt/', group: 'SaaS & Apps' },

  { name: 'VizitAR LFC', sector: 'High-performance 3D model renderer', stack: 'Nuxt.js, TypeScript, 3D viewport', url: 'https://lfc.ar.vizitar.com', group: 'Immersive & WebAR' },
  { name: 'VizitAR Backoffice', sector: 'Multi-tenant CMS & 3D scene assembly', stack: 'Nuxt.js, Custom CMS', group: 'Immersive & WebAR' },
  { name: 'VizitAR Tours Dashboard', sector: 'Tour analytics & gamification', stack: 'Nuxt.js, Analytics', url: 'https://tours.vizitar.com/dashboard', group: 'Immersive & WebAR' },
  { name: 'CM Setúbal Tours', sector: 'Heritage & mapping', stack: 'Nuxt.js, Geospatial', url: 'https://cm-setubal.tours.vizitar.com', group: 'Immersive & WebAR' },
  { name: 'VizitAR Pixel', sector: 'EdTech 360° media player', stack: 'Nuxt.js, WebVR / WebAR', url: 'https://pixel.vizitar.com', group: 'Immersive & WebAR' },
  { name: 'Escola Digital Axis', sector: 'EdTech learning platform', stack: 'Nuxt.js, Modular layouts', url: 'https://escoladigital.axis.vizitar.com', group: 'Immersive & WebAR' },
  { name: 'Virtual Eurospuma', sector: 'Industrial virtual showroom', stack: 'Nuxt.js, Content systems', url: 'https://eurospuma.virtual.vizitar.com', group: 'Immersive & WebAR' },

  { name: 'La Bomba Studio', sector: 'Creative agency', stack: 'Nuxt.js SSR, High-FPS animation', url: 'https://labomba.studio/', group: 'Brand & Corporate' },
  { name: 'Natixis Brains', sector: 'Corporate tech hub', stack: 'Custom WordPress, ACF Pro, CWV', url: 'https://wewantyourbrain.com/', group: 'Brand & Corporate' },
  { name: 'Rasgo', sector: 'Brand studio', stack: 'Bespoke UI, Micro-interactions', url: 'https://rasgo.pt/', group: 'Brand & Corporate' },
  { name: 'Kia Portugal', sector: 'Automotive', stack: 'Custom WordPress, Modular SCSS', url: 'https://kia.pt/', group: 'Brand & Corporate' },
  { name: 'Kia Portugal Mobile', sector: 'Automotive', stack: 'Mobile architecture', url: 'https://m.kia.pt/', group: 'Brand & Corporate' },
  { name: 'Endesa Plano Amigo', sector: 'Energy', stack: 'Custom WordPress, ES6+', url: 'https://planoamigoendesa.pt/cliente/', group: 'Brand & Corporate' },
  { name: 'Planetiers', sector: 'Sustainability', stack: 'HTML5, CSS3, Modular JS', url: 'https://www.planetiers.com', group: 'Brand & Corporate' },
  { name: 'Forum Aveiro', sector: 'Retail', stack: 'Custom WordPress, Design system', url: 'https://forumaveiro.com/', group: 'Brand & Corporate' },
  { name: 'Alameda Shop & Spot', sector: 'Retail', stack: 'Custom WordPress, CWV', url: 'https://alamedashopping.pt/', group: 'Brand & Corporate' },
  { name: 'TorreShopping', sector: 'Commercial center', stack: 'Custom WordPress', url: 'https://torreshopping.pt/', group: 'Brand & Corporate' },
  { name: 'Nosso Shopping', sector: 'Retail', stack: 'Custom WordPress, Mobile-first', url: 'https://nossoshopping.pt/', group: 'Brand & Corporate' },
  { name: '8Avenida', sector: 'Commercial center', stack: 'Custom WordPress, ACF', url: 'https://www.8avenida.com/', group: 'Brand & Corporate' },
  { name: 'Barão Fladgate', sector: 'Hospitality & tourism', stack: 'Custom theme, ACF Pro', url: 'https://www.baraofladgate.com/', group: 'Brand & Corporate' },
  { name: 'Croft Pink', sector: 'Beverage brand', stack: 'Custom WordPress, Canvas / JS', url: 'https://croftpink.com/pt/', group: 'Brand & Corporate' },
  { name: 'Igreja Santa Clara Porto', sector: 'Cultural heritage', stack: 'Custom WordPress, Accessibility', url: 'https://santaclaraporto.pt/', group: 'Brand & Corporate' },
  { name: 'Conquistador Palace', sector: 'Luxury hospitality', stack: 'SASS, Tailored CSS', url: 'https://conquistadorpalace.pt/', group: 'Brand & Corporate' },
  { name: 'HWL Surf', sector: 'E-commerce · Sports', stack: 'Custom WordPress storefront', url: 'https://hwlsurf.pt/', group: 'Brand & Corporate' },
  { name: 'Utopian Hotels', sector: 'Hospitality group', stack: 'Custom WordPress', url: 'https://utopian.pt/', group: 'Brand & Corporate' },
  { name: 'CBRE Edifício 24', sector: 'Real estate', stack: 'Institutional portal', url: 'https://edificio24dejulho98.pt/', group: 'Brand & Corporate' },
];

const all = [...featured, ...archive];
export const projectCount = all.length;
export const countByGroup = (group: Group) => all.filter((p) => p.group === group).length;
