import '@testing-library/jest-dom/jest-globals'

// Polyfill for TransformStream (needed by eventsource-parser)
const { TransformStream } = await import('node:stream/web')
globalThis.TransformStream = TransformStream as typeof globalThis.TransformStream

// Mock import.meta.env for tests
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_OPENAI_API_KEY: 'test-api-key',
    MODE: 'test',
    DEV: true,
    PROD: false,
    SSR: false,
  },
})
