import type { ImageMetadata } from 'astro';
import projectsData from '../data/projects.json';
import siteData from '../data/site.json';
import type { Category, Lang } from '../i18n/ui';

export const site = siteData;

export interface Project {
  slug: string;
  todo?: boolean;
  category: Category;
  title_en: string;
  title_ar: string;
  client: string;
  year: number | string;
  cover: string;
  video?: string;
  video_file?: string;
  video_poster?: string;
  gallery?: string[];
  description_en: string;
  description_ar: string;
  role_en: string;
  role_ar: string;
  tools?: string[];
}

// Normalise what the admin panel may save (empty strings, empty list items).
export const projects = (projectsData as Project[]).map((p) => ({
  ...p,
  gallery: (p.gallery ?? []).filter(Boolean),
  tools: (p.tools ?? []).filter(Boolean),
}));

const seen = new Set<string>();
for (const p of projects) {
  if (seen.has(p.slug)) throw new Error(`[portfolio] Two projects use the slug "${p.slug}". Each project needs its own slug.`);
  seen.add(p.slug);
}

export const t = (p: Project, field: 'title' | 'description' | 'role', lang: Lang) =>
  p[`${field}_${lang}`];

/** Prefix an internal path with the deploy base (e.g. /eslam-portfolio). */
export function url(path = '') {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

/** Path of the same page in the other language. */
export function switchLangPath(pathname: string, to: Lang) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rest = pathname.slice(base.length).replace(/^\/(ar|en)(?=\/|$)/, '');
  return `${base}/${to}${rest || '/'}`;
}

// ─── Images ────────────────────────────────────────────────────────
// Every image under src/assets is optimised at build time (resized + WebP).
// In projects.json you write paths relative to src/assets, e.g. "projects/my-slug/cover.jpg".
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

export function resolveImage(path: string): ImageMetadata | string {
  if (/^https?:\/\//.test(path)) return path;
  const key = '/src/assets/' + path.replace(/^\/?(src\/assets\/)?/, '');
  const found = images[key];
  if (!found) {
    throw new Error(
      `[portfolio] Image not found: "${path}". Put the file in src/assets/ and use a path relative to that folder (e.g. "projects/my-slug/cover.jpg").`,
    );
  }
  return found.default;
}

// ─── Video ─────────────────────────────────────────────────────────
export type Video =
  | { kind: 'youtube'; id: string; embed: string }
  | { kind: 'vimeo'; id: string; embed: string }
  | { kind: 'mp4'; src: string };

/** Accepts any YouTube / Vimeo link (watch, share, embed) or a local .mp4 under public/. */
export function parseVideo(input?: string): Video | null {
  if (!input) return null;
  const v = input.trim();
  const yt = v.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: 'youtube', id: yt[1], embed: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1` };
  const vm = v.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/);
  if (vm) {
    const hash = vm[2] ? `&h=${vm[2]}` : '';
    return { kind: 'vimeo', id: vm[1], embed: `https://player.vimeo.com/video/${vm[1]}?autoplay=1&dnt=1${hash}` };
  }
  if (/\.(mp4|webm)(\?.*)?$/i.test(v)) return { kind: 'mp4', src: url(v) };
  console.warn(`[portfolio] Unrecognised video value "${input}" — use a YouTube/Vimeo link or a .mp4 path.`);
  return null;
}
