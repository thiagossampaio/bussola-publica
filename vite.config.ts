import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          injectRegister: 'auto',
          manifest: {
            name: 'Bússola Política AI',
            short_name: 'Bússola Política',
            description:
              'Descubra seu posicionamento político em 4 eixos com IA. Questionário anônimo, resultado explicável e ranking global.',
            lang: 'pt-BR',
            start_url: '/',
            scope: '/',
            display: 'standalone',
            background_color: '#0f172a',
            theme_color: '#4f46e5',
            categories: ['education', 'productivity', 'politics'],
            icons: [
              {
                src: '/icons/icon-192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png'
              },
              {
                src: '/icons/icon-192-maskable.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
              },
              {
                src: '/icons/icon-512-maskable.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
              }
            ]
          },
          workbox: {
            cleanupOutdatedCaches: true,
            navigateFallback: '/index.html',
            globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'google-fonts-stylesheets',
                  expiration: {
                    maxEntries: 16,
                    maxAgeSeconds: 60 * 60 * 24 * 365
                  }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-webfonts',
                  expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 60 * 60 * 24 * 365
                  }
                }
              },
              {
                urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'tailwind-cdn',
                  expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 60 * 60 * 24 * 30
                  }
                }
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
