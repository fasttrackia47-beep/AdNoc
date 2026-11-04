import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — чтобы сборка открывалась и с GitHub Pages (/AdNoc/), и локально.
export default defineConfig({ plugins: [react()], base: './' });
