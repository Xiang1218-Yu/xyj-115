import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

globalThis.localStorage = new LocalStorageMock();

Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:5173',
    href: 'http://localhost:5173/',
    pathname: '/',
    search: '',
  },
  writable: true,
});

globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
globalThis.URL.revokeObjectURL = vi.fn();

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
