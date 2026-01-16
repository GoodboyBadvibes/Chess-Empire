import { db } from "./db";
import {
  roles,
  applications,
  products,
  stories,
  type Role,
  type Application,
  type Product,
  type Story,
  type InsertApplication
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Roles
  getRoles(): Promise<Role[]>;
  getRole(id: number): Promise<Role | undefined>;
  
  // Applications
  createApplication(app: InsertApplication): Promise<Application>;
  
  // Products
  getProducts(): Promise<Product[]>;
  
  // Stories
  getStories(): Promise<Story[]>;
  getStory(id: number): Promise<Story | undefined>;
  
  // Seed helpers
  createRole(role: any): Promise<Role>;
  createProduct(product: any): Promise<Product>;
  createStory(story: any): Promise<Story>;
}

export class DatabaseStorage implements IStorage {
  // Roles
  async getRoles(): Promise<Role[]> {
    return await db.select().from(roles).where(eq(roles.isActive, true));
  }

  async getRole(id: number): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }
  
  async createRole(role: any): Promise<Role> {
    const [newRole] = await db.insert(roles).values(role).returning();
    return newRole;
  }

  // Applications
  async createApplication(app: InsertApplication): Promise<Application> {
    const [newApp] = await db.insert(applications).values(app).returning();
    return newApp;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async createProduct(product: any): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  // Stories
  async getStories(): Promise<Story[]> {
    return await db.select().from(stories);
  }

  async getStory(id: number): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story;
  }
  
  async createStory(story: any): Promise<Story> {
    const [newStory] = await db.insert(stories).values(story).returning();
    return newStory;
  }
}

export const storage = new DatabaseStorage();
