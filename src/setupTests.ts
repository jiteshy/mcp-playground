import '@testing-library/jest-dom';

// Mock IntersectionObserver
Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: class IntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords() { return []; }
  },
});

// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
}); 