import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        index2: path.resolve(__dirname, 'index-2.html'),
        index3: path.resolve(__dirname, 'index-3.html'),
        about: path.resolve(__dirname, 'about.html'),
        services: path.resolve(__dirname, 'services.html'),
        serviceDetail: path.resolve(__dirname, 'service-detail.html'),
        team: path.resolve(__dirname, 'team.html'),
        teamDetail: path.resolve(__dirname, 'team-detail.html'),
        testimonials: path.resolve(__dirname, 'testimonial.html'),
        pricing: path.resolve(__dirname, 'pricing.html'),
        faq: path.resolve(__dirname, 'faq.html'),
        blog: path.resolve(__dirname, 'blog.html'),
        blogClassic: path.resolve(__dirname, 'blog-classic.html'),
        blogDetail: path.resolve(__dirname, 'news-detail.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        login: path.resolve(__dirname, 'login.html'),
        register: path.resolve(__dirname, 'register.html'),
        reset: path.resolve(__dirname, 'reset.html'),
        notFound: path.resolve(__dirname, 'not-found.html'),
      },
    },
  },
})
