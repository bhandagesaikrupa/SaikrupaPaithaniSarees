
// Configuration for API Base URL
// This determines the correct API endpoint based on the current environment.

/**
 * NOTE ON .env FILES IN FRONTEND:
 * You cannot use a .env file directly in the frontend (the 'pages' folder).
 * .env files are for server-side code (Node.js/Backend only).
 * This config.js file achieves the same goal by automatically detecting 
 * if you are running on Localhost or Production.
 */

// Helper function to check if we are in a development environment
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    ) ||
    // Also consider local network IPs as localhost for development purposes
    window.location.hostname.startsWith('192.168.')
);

// Define global API_BASE_URL
// If the backend and frontend are deployed together as a single unit (on the same domain),
// we use an empty string. This makes all fetch calls relative (e.g., fetch('/api/products')),
// which is the most reliable way to handle deployment.
let API_BASE_URL = '';

if (isLocalhost) {
    if (window.location.port === '5000') {
        // We are accessing the backend directly -> Use relative paths
        API_BASE_URL = '';
    } else {
        // We are using a Dev Server (like VS Code Live Server on port 5500/5501)
        // -> We must point to the backend on port 5000.
        API_BASE_URL = 'http://localhost:5000';
    }
} else {
    // PRODUCTION
    // In production, the backend always serves the frontend from the same domain.
    // Therefore, an empty string (relative path) is correct.
    API_BASE_URL = '';
}

// Attach to window to ensure global access across all scripts
window.API_BASE_URL = API_BASE_URL;

console.log('🚀 Environment:', isLocalhost ? 'Development' : 'Production');
console.log('📍 API Base URL:', API_BASE_URL || '(Same Origin)');
