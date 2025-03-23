import session from "cookie-session";

type UserInfo = {
  id: string;
  username: string;
  email: string;
};

declare module "express-serve-static-core" {
  interface Request {
    session: session.Session;
    user?: UserInfo;
  }
}
