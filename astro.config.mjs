// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://devrequest.vercel.app'
});
