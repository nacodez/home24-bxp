import '@testing-library/jest-dom';
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';

interface GlobalWithTextEncoderDecoder {
    TextEncoder: typeof NodeTextEncoder;
    TextDecoder: typeof NodeTextDecoder;
}

const globalObj = global as unknown as GlobalWithTextEncoderDecoder;

if (typeof globalObj.TextEncoder === 'undefined') {
    globalObj.TextEncoder = NodeTextEncoder;
}

if (typeof globalObj.TextDecoder === 'undefined') {

    globalObj.TextDecoder = NodeTextDecoder;
}

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock localStorage
const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});