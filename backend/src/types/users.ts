export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserRegistration = Omit<User, "id" | "createdAt" | "updatedAt">;

export type UserLogin = {
  email: string;
  password: string;
};
