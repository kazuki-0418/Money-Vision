import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: any; // Adjust the type according to your user object structure
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}