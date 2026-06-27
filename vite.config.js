import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createReadStream, existsSync } from 'fs'
import { cp } from 'fs/promises'

const mimeTypes = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp',
}

export default defineConfig({
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },

  build: {
    // Never emit source maps in production — exposes original source to anyone with DevTools
    sourcemap: false,

    // Raise the warning threshold; pdfjs is intentionally large
    chunkSizeWarningLimit: 1400,

    rollupOptions: {
      output: {
        // Split heavy dependencies into separate cached chunks.
        // Visitors who return only re-download changed chunks, not the full bundle.
        manualChunks(id) {
          if (id.includes('pdfjs-dist'))   return 'pdfjs'
          if (id.includes('framer-motion')) return 'framer'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },

  plugins: [
    react(),
    {
      name: 'serve-local-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = decodeURIComponent(req.url.split('?')[0])
          if (url.startsWith('/PROJECTS/')) {
            const filePath = path.join(process.cwd(), url)
            if (existsSync(filePath)) {
              const ext = path.extname(filePath).toLowerCase()
              res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
              if (ext === '.pdf') res.setHeader('Content-Disposition', 'inline')
              createReadStream(filePath).pipe(res)
              return
            }
          }
          next()
        })
      },
      async closeBundle() {
        for (const folder of ['PROJECTS']) {
          const src = path.join(process.cwd(), folder)
          const dest = path.join(process.cwd(), 'dist', folder)
          if (existsSync(src)) await cp(src, dest, { recursive: true })
        }
      },
    },
  ],
})
