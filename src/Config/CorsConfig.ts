const corsOptions = {
  origin: 'http://localhost',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Foo'],
  credentials: true
};
export { corsOptions };