import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE_IMAGES, type SiteImageName } from './src/data/siteImages';

// Hero image of each public page that opens with one: either the eager ResponsiveImage at the
// top (name/mobileName), or a CSS background photo (bg). For a background, list the exact URLs
// the page's stylesheet uses below and above 768px, or the preload is wasted.
type PageHero =
  | { name: SiteImageName; mobileName?: SiteImageName }
  | { bg: { mobile: string; desktop: string } };
const unsplash = (photo: string, w: number) =>
  `https://images.unsplash.com/${photo}?w=${w}&auto=format&fit=crop&q=85`;
const unsplashHero = (photo: string) => ({ bg: { mobile: unsplash(photo, 828), desktop: unsplash(photo, 1920) } });
const PAGE_HEROES: Record<string, PageHero> = {
  home: { name: 'hero-home', mobileName: 'hero-home-mobile' },
  track: { name: 'track-hero' },
  services: { name: 'services-hero' },
  about: { name: 'about-hero' },
  locations: { name: 'locations-hero' },
  quote: unsplashHero('photo-1580674684081-7617fbf3d745'), // QuotePage.css .ngf-quote-hero
  contact: unsplashHero('photo-1522071820081-009f0129c71c'), // ContactPage.css .ngf-contact-hero
  help: unsplashHero('photo-1497366216548-37526070297c'), // HelpPage.css .ngf-help-hero
  legal: unsplashHero('photo-1486406146926-c627a92ad1ab'), // LegalPage.css .ngf-legal-hero
};

// The hero is the largest thing on screen, but in a single-page app the browser only finds it
// after the JavaScript has run and rendered. This inline script runs while the HTML is still
// being parsed and preloads the hero of the page being opened (for a ResponsiveImage the same
// WebP srcset, sizes and mobile breakpoint; for a background the URL for the screen width), so
// the download starts right away. The page is worked out from the hash the same way as
// getInitialPage() in App.tsx.
function heroPreload(): Plugin {
  const srcset = (name: SiteImageName) =>
    SITE_IMAGES[name].widths.map((w) => `/images/site/${name}-${w}.webp ${w}w`).join(', ');
  const heroes = Object.fromEntries(
    Object.entries(PAGE_HEROES).map(([page, h]) => [
      page,
      'bg' in h
        ? { bm: h.bg.mobile, bd: h.bg.desktop }
        : { d: srcset(h.name), m: h.mobileName ? srcset(h.mobileName) : undefined },
    ]),
  );
  const script = `(function(){try{
var H=${JSON.stringify(heroes)};
if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
var t=location.hash.replace('#','');
if(t.indexOf('/track/')===0||t.indexOf('/quote/')===0)return;
var p=t.charAt(0)==='/'?t.slice(1).split('/')[0]:'';
var h=H[p]||(${JSON.stringify(['track', 'services', 'quote', 'ship', 'about', 'help', 'contact', 'legal', 'locations', 'admin'])}.indexOf(p)<0?H.home:null);
if(!h)return;
function add(s,media,url){var l=document.createElement('link');l.rel='preload';l.as='image';
if(url)l.href=s;else{l.type='image/webp';l.setAttribute('imagesrcset',s);l.setAttribute('imagesizes','100vw');}
l.setAttribute('fetchpriority','high');if(media)l.media=media;document.head.appendChild(l);}
if(h.bm){add(h.bm,'(max-width: 767px)',1);add(h.bd,'(min-width: 768px)',1);}
else if(h.m){add(h.m,'(max-width: 767px)');add(h.d,'(min-width: 768px)');}else add(h.d);
}catch(e){}})();`;
  // Placed straight after the viewport meta: before it, a phone still reports a 980px desktop
  // viewport, and the wrong (desktop) image would be chosen. Also before any stylesheet, since
  // a script after a stylesheet waits for that stylesheet to download.
  const VIEWPORT = /<meta name="viewport"[^>]*>/;
  return {
    name: 'tervexa-hero-preload',
    transformIndexHtml(html) {
      if (!VIEWPORT.test(html)) throw new Error('hero preload: viewport meta not found in index.html');
      return html.replace(VIEWPORT, (m) => `${m}\n    <script>${script}</script>`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), heroPreload()],
  // The assets folder in this repo is capitalized (Public/), not Vite's default lowercase
  // "public" — Windows' case-insensitive filesystem silently papered over the mismatch in
  // every local dev/build run, but Hostinger's Linux build server is case-sensitive and
  // couldn't find it at all, so none of these assets (including the logo) ever made it into
  // the production build.
  publicDir: 'Public',
  server: {
    host: true,
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
