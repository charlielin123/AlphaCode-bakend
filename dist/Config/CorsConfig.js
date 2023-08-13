"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const corsOptions = {
    origin: 'http://localhost',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Foo'],
    credentials: true
};
exports.corsOptions = corsOptions;
//# sourceMappingURL=CorsConfig.js.map