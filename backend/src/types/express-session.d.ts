import session from "express-session";

declare module "express-session" {
  interface SessionData {
    user: {
      id: string;
      username: string;
      email: string;
    };
  }
}

declare module "express-serve-static-core" {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}
