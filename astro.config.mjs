import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// User site (Zafff-e.github.io) is served from the domain root, so no `base` is needed.
export default defineConfig({
  site: 'https://zafff-e.github.io',
  vite: { plugins: [tailwindcss()] },
});
