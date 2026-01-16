import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Roles
  app.get(api.roles.list.path, async (req, res) => {
    const roles = await storage.getRoles();
    res.json(roles);
  });

  app.get(api.roles.get.path, async (req, res) => {
    const role = await storage.getRole(Number(req.params.id));
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  });

  // Applications
  app.post(api.applications.create.path, async (req, res) => {
    try {
      const input = api.applications.create.input.parse(req.body);
      const application = await storage.createApplication(input);
      res.status(201).json(application);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  // Stories
  app.get(api.stories.list.path, async (req, res) => {
    const stories = await storage.getStories();
    res.json(stories);
  });

  app.get(api.stories.get.path, async (req, res) => {
    const story = await storage.getStory(Number(req.params.id));
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingRoles = await storage.getRoles();
  if (existingRoles.length === 0) {
    // Roles
    await storage.createRole({
      title: "Head of Storytelling",
      description: "You will define the voice of the biggest chess company in the world. We need someone who understands narrative depth and human connection.",
      category: "Media",
    });
    await storage.createRole({
      title: "Product Designer (Physical)",
      description: "Design luxury chess boards that are pieces of art. Experience with premium materials (wood, stone, metal) required.",
      category: "Design",
    });
    await storage.createRole({
      title: "Founding Full Stack Engineer",
      description: "Build the digital ecosystem that connects the physical and media worlds. Next.js, React, Node.js expert.",
      category: "Engineering",
    });

    // Products
    await storage.createProduct({
      name: "The Grandmaster Edition",
      description: "Hand-carved ebony and maple tournament board.",
      price: 49900,
      category: "Board",
      imageUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=1000",
    });
    await storage.createProduct({
      name: "Minimalist Travel Set",
      description: "Magnetic, aerospace-grade aluminum pieces.",
      price: 15000,
      category: "Board",
      imageUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&q=80&w=1000",
    });
    await storage.createProduct({
      name: "The Vision Hoodie",
      description: "Heavyweight cotton, oversized fit. 'Bigger Than Chess' print.",
      price: 8500,
      category: "Merch",
      imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000",
    });

    // Stories
    await storage.createStory({
      title: "The Art of Patience",
      excerpt: "What 10 years of chess taught me about building a company.",
      content: "Chess is often misunderstood as a game of pure intellect. But at its core, it is a game of character...",
      author: "Founder",
      imageUrl: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&q=80&w=1000",
    });
    await storage.createStory({
      title: "Street Chess Culture",
      excerpt: "From Union Square to the world. The raw energy of blitz.",
      content: "The clock slams. Trash talk flies. This isn't a quiet library. This is the arena...",
      author: "Editorial Team",
      imageUrl: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&q=80&w=1000",
    });
  }
}
