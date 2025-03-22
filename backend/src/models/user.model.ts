import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { User, UserRegistration } from "../types";

// In-memory database for users
class UserModel {
  private users: User[] = [];

  // Create a new user
  async create(userData: UserRegistration): Promise<Omit<User, "password">> {
    // Check if user with email already exists
    const existingUser = this.users.find((user) => user.email === userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser: User = {
      id: uuidv4(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Find user by ID
  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  // Find user by email
  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  // Authenticate user
  async authenticate(email: string, password: string): Promise<Omit<User, "password"> | null> {
    const user = this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get all users (for admin purposes)
  getAll(): Omit<User, "password">[] {
    return this.users.map(({ password, ...user }) => user);
  }
}

export default new UserModel();
