import '@testing-library/jest-dom';

// Mock solid-motionone to avoid animation issues in tests
import { vi } from 'vitest';
import { JSX } from 'solid-js';

vi.mock('solid-motionone', () => ({
  Motion: new Proxy(
    {},
    {
      get: () => (props: { children?: JSX.Element }) => {
        return props.children;
      },
    }
  ),
  Presence: (props: { children: JSX.Element }) => props.children,
}));

// Mock scrollIntoView for jsdom
Element.prototype.scrollIntoView = vi.fn();

// Viewport testing utilities
export const setViewport = (width: number, height: number = 768) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

// Common viewport presets
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1024, height: 768 },
} as const;
