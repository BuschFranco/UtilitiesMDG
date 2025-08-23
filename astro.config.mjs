// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://devrequest.vercel.app',
  vite: {
    define: {
      'process.env.SMTP_HOST': JSON.stringify(env.SMTP_HOST),
      'process.env.SMTP_PORT': JSON.stringify(env.SMTP_PORT),
      'process.env.SMTP_USER': JSON.stringify(env.SMTP_USER),
      'process.env.SMTP_PASS': JSON.stringify(env.SMTP_PASS),
      'process.env.RECIPIENT_EMAIL': JSON.stringify(env.RECIPIENT_EMAIL),
      'process.env.EMAIL_TO': JSON.stringify(env.EMAIL_TO)
    }
  }
});
