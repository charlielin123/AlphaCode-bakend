declare global {
  namespace Express {
    interface User {
      email: string;
      _id: string;
    }
  }
}
