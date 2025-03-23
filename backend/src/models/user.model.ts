import bcrypt from "bcrypt";
import { SupabaseService } from "../infrastructure/supabase";
import { getSupabaseClient, handleSupabaseError } from "../infrastructure/supabase/supabase-client";
import { User, UserRegistration } from "../types/users";

class UserModel {
  private userService;

  constructor() {
    const { user } = SupabaseService;
    this.userService = user;
  }

  async create(userData: UserRegistration): Promise<Omit<User, "password">> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const createdUser = await this.userService.createUser({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    });

    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    const { password, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.userService.getUser(id);
    return user || undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const { data, error } = await getSupabaseClient()
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !data) {
        return undefined;
      }

      return data as User;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "findByEmail");
      }
      return undefined;
    }
  }

  async authenticate(email: string, password: string): Promise<Omit<User, "password"> | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAll(): Promise<Omit<User, "password">[]> {
    try {
      const { data, error } = await getSupabaseClient().from("users").select("*");

      if (error || !data) {
        return [];
      }

      return data.map(({ password, ...user }: User) => user);
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getAll");
      }
      return [];
    }
  }
}

export default new UserModel();
