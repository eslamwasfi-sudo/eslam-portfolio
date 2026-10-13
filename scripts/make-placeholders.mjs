// Generates TODO placeholder images (project covers, galleries, hero poster, OG image)
// and a tiny muted showreel loop. Run once with `npm run placeholders`.
// You never need this again once you replace the placeholders with real work.
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';

const projects = JSON.parse(readFileSync('src/data/projects.json', 'utf8'));

// One mood per category so the placeholder grid already feels "cinematic".
const palettes = {
  'ai-video': ['#1a0f2e', '#3b1d4a', '#e9a25b'],
  campaigns: ['#2a1208', '#5a2410', '#f0b878'],
  branding: ['#0e1a1a', '#173a36', '#d9c7a0'],
  '3d': ['#0c1222', '#1d2f4f', '#9fb8d9'],
};

function svg({ w, h, colors: [a, b, glow], index, label }) {
  const big = Math.round(Math.min(w, h) * 0.55);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="68%" cy="32%" r="85%">
      <stop offset="0" stop-color="${glow}" stop-opacity=".55"/>
      <stop offset=".35" stop-color="${b}"/>
      <stop offset="1" stop-color="${a}"/>
    </radialGradient>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".5" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".6"/>
    </linearGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .06 0"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="${w * 0.68}" cy="${h * 0.34}" r="${Math.min(w, h) * 0.18}" fill="none" stroke="${glow}" stroke-opacity=".35" stroke-width="2"/>
  <text x="${w * 0.06}" y="${h * 0.9}" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="${big}" fill="#fff" fill-opacity=".07">${index}</text>
  <rect width="100%" height="100%" fill="url(#v)"/>
  <rect width="100%" height="100%" filter="url(#n)"/>
  ${label ? `<text x="${w / 2}" y="${h * 0.55}" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="${Math.round(Math.min(w, h) * 0.035)}" fill="#fff" fill-opacity=".8" letter-spacing="3">TODO · ${label}</text>` : ''}
</svg>`;
}

async function out(path, opts, w, h) {
  await sharp(Buffer.from(svg({ w, h, ...opts })))
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path);
  console.log('wrote', path);
}

let i = 0;
for (const p of projects) {
  i++;
  const dir = `src/assets/projects/${p.slug}`;
  mkdirSync(dir, { recursive: true });
  const colors = palettes[p.category] ?? palettes['ai-video'];
  const index = String(i).padStart(2, '0');
  await out(`${dir}/cover.jpg`, { colors, index, label: 'REPLACE COVER' }, 1600, 1000);
  await out(`${dir}/gallery-1.jpg`, { colors, index: '1', label: 'REPLACE GALLERY IMAGE' }, 1600, 1000);
  await out(`${dir}/gallery-2.jpg`, { colors: [colors[1], colors[0], colors[2]], index: '2', label: 'REPLACE' }, 1000, 1250);
  await out(`${dir}/gallery-3.jpg`, { colors: [colors[0], colors[0], colors[2]], index: '3', label: 'REPLACE' }, 1000, 1250);
}

// Hero poster (first frame people see before the loop starts).
mkdirSync('src/assets', { recursive: true });
await out('src/assets/showreel-poster.jpg', { colors: ['#0b0b0c', '#2a160b', '#e9a25b'], index: '', label: '' }, 1920, 1080);

// Open Graph image used when the link is shared on WhatsApp / Instagram / X.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><radialGradient id="g" cx="80%" cy="20%" r="90%"><stop offset="0" stop-color="#e9a25b" stop-opacity=".45"/><stop offset=".45" stop-color="#1a120c"/><stop offset="1" stop-color="#0b0b0c"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="80" y="140" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="44" fill="#e9a25b">إسلام وصفي</text>
  <text x="80" y="330" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="104" fill="#f2efe9">ESLAM WASFI</text>
  <text x="80" y="410" font-family="IBM Plex Sans Arabic" font-size="40" fill="#f2efe9" fill-opacity=".85">Art Director &amp; AI Creative Director</text>
  <text x="80" y="540" font-family="IBM Plex Sans Arabic" font-size="28" fill="#f2efe9" fill-opacity=".55">AI Video · Campaigns · Branding · 3D Previz — Egypt &amp; the Gulf</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 85, mozjpeg: true }).toFile('public/og-image.jpg');
console.log('wrote public/og-image.jpg');

// Short muted showreel loop placeholder (≈6s, 720p, tiny). Requires ffmpeg.
mkdirSync('public/videos', { recursive: true });
if (!existsSync('public/videos/showreel-loop.mp4')) {
  try {
    execFileSync('ffmpeg', [
      '-y', '-f', 'lavfi', '-i',
      'gradients=s=1280x720:d=6:speed=0.02:c0=0x0b0b0c:c1=0x3a1e0c:c2=0xe9a25b:c3=0x1a0f2e:n=4:type=radial,format=yuv420p',
      '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-r', '24', '-movflags', '+faststart',
      'public/videos/showreel-loop.mp4',
    ], { stdio: 'inherit' });
  } catch {
    console.warn('ffmpeg not available — skipped showreel loop');
  }
}
