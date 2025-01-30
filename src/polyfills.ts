(window as any).global = window;
(window as any).process = require('process/browser');
(window as any).Buffer = require('buffer').Buffer;

// Adicione os polyfills necessários
(window as any).crypto = require('crypto-browserify');
(window as any).stream = require('stream-browserify');
(window as any).http = require('stream-http');
(window as any).https = require('https-browserify');
(window as any).os = require('os-browserify/browser');
(window as any).vm = require('vm-browserify');
(window as any).url = require('url');
(window as any).util = require('util');
