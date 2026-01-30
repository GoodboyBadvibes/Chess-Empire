import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// For serverless: use connection pooling via Supabase pooler
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Serverless-optimized settings
  max: 1, // Limit connections for serverless
  idleTimeoutMillis: 10000, // Close idle connections quickly
});

export const db = drizzle(pool, { schema });

// Database service class
class DatabaseService {
  async getRoles() {
    try {
      return await db.query.roles.findMany({
        where: (roles, { eq }) => eq(roles.isActive, true),
      });
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }

  async getRole(id: number) {
    try {
      const [role] = await db.query.roles.findMany({
        where: (roles, { eq }) => eq(roles.id, id),
      });
      return role;
    } catch (error) {
      console.error("Error fetching role:", error);
      return null;
    }
  }

  async createRole(data: any) {
    try {
      const [role] = await db.insert(schema.roles).values(data).returning();
      return role;
    } catch (error) {
      console.error("Error creating role:", error);
      return null;
    }
  }

  async createApplication(data: any) {
    try {
      const [app] = await db
        .insert(schema.applications)
        .values(data)
        .returning();
      return app;
    } catch (error) {
      console.error("Error creating application:", error);
      return null;
    }
  }

  async getProducts() {
    try {
      return await db.query.products.findMany();
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async createProduct(data: any) {
    try {
      const [product] = await db.insert(schema.products).values(data).returning();
      return product;
    } catch (error) {
      console.error("Error creating product:", error);
      return null;
    }
  }

  async getStories() {
    try {
      return await db.query.stories.findMany();
    } catch (error) {
      console.error("Error fetching stories:", error);
      return [];
    }
  }

  async getStory(id: number) {
    try {
      const [story] = await db.query.stories.findMany({
        where: (stories, { eq }) => eq(stories.id, id),
      });
      return story;
    } catch (error) {
      console.error("Error fetching story:", error);
      return null;
    }
  }

  async createStory(data: any) {
    try {
      const [story] = await db.insert(schema.stories).values(data).returning();
      return story;
    } catch (error) {
      console.error("Error creating story:", error);
      return null;
    }
  }

  // Seed database if needed
  async seedDatabase() {
    const roles = await this.getRoles();
    if (roles.length > 0) return; // Already seeded

    await this.createRole({
      title: "Head of Storytelling",
      description:
        "You will define the voice of the biggest chess company in the world. We need someone who understands narrative depth and human connection.",
      category: "Media",
    });

    await this.createRole({
      title: "Product Designer (Physical)",
      description:
        "Design luxury chess boards that are pieces of art. Experience with premium materials (wood, stone, metal) required.",
      category: "Design",
    });

    await this.createRole({
      title: "Founding Full Stack Engineer",
      description:
        "Build the digital ecosystem that connects the physical and media worlds. Next.js, React, Node.js expert.",
      category: "Engineering",
    });

    await this.createProduct({
      name: "The Grandmaster Edition",
      description: "Hand-carved ebony and maple tournament board.",
      price: 49900,
      category: "Board",
      imageUrl:
        "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=1000",
    });

    await this.createProduct({
      name: "Minimalist Travel Set",
      description: "Magnetic, aerospace-grade aluminum pieces.",
      price: 15000,
      category: "Board",
      imageUrl:
        "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&q=80&w=1000",
    });

    await this.createProduct({
      name: "The Vision Hoodie",
      description: "Heavyweight cotton, oversized fit. 'Bigger Than Chess' print.",
      price: 8500,
      category: "Merch",
      imageUrl:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000",
    });

    await this.createStory({
      title: "The Art of Patience",
      excerpt: "What 10 years of chess taught me about building a company.",
      content:
        "Chess is often misunderstood as a game of pure intellect. But at its core, it is a game of character...",
      author: "Founder",
      imageUrl:
        "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&q=80&w=1000",
    });

    await this.createStory({
      title: "Street Chess Culture",
      excerpt: "From Union Square to the world. The raw energy of blitz.",
      content:
        "The clock slams. Trash talk flies. This isn't a quiet library. This is the arena...",
      author: "Editorial Team",
      imageUrl:
        "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&q=80&w=1000",
    });
  }
}

export const Ce = new DatabaseService();
