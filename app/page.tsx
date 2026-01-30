"use client";

import { Navbar } from "@/components/Navbar";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { type Role } from "@shared/schema";
import { useEffect, useState } from "react";

export default function Home() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [rolesRes, productsRes, storiesRes] = await Promise.all([
          fetch("/api/roles"),
          fetch("/api/products"),
          fetch("/api/stories"),
        ]);

        const rolesData = await rolesRes.json();
        const productsData = await productsRes.json();
        const storiesData = await storiesRes.json();

        setRoles(rolesData);
        setProducts(productsData);
        setStories(storiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const HERO_IMAGE =
    "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-white">
      <Navbar />

      {/* === HERO === */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={HERO_IMAGE}
            alt="Chess Vision"
            className="w-full h-full object-cover grayscale opacity-90"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center text-white space-y-8">
          <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none">
            BIGGER THAN
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
              CHESS.
            </span>
          </h1>

          <p className="font-serif-italic text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            We are building the world's most significant chess company.
            <br />
            And telling deeply human stories along the way.
          </p>

          <div>
            <Button
              onClick={() =>
                document
                  .getElementById("manifesto")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              variant="outline"
              className="bg-transparent text-white border-white/30 hover:bg-white hover:text-black rounded-none px-8 py-6 text-lg tracking-widest uppercase transition-all duration-500"
            >
              Explore the Vision
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent mx-auto" />
        </div>
      </section>

      {/* === MANIFESTO === */}
      <Section id="manifesto" className="bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent">
            The Vision
          </span>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Chess is not just a game. <br />
            It is a language of{" "}
            <span className="font-serif-italic text-accent">intellect</span> and{" "}
            <span className="font-serif-italic text-accent">war</span>.
          </h2>
          <div className="prose prose-lg md:prose-xl mx-auto text-muted-foreground font-light leading-relaxed">
            <p>
              We believe the chess world has been stagnant for too long. We are
              here to disrupt it with luxury, storytelling, and technology. We're
              creating an ecosystem that bridges the gap between the grandmaster
              and the artist,
            </p>
          </div>
        </div>
      </Section>

      {/* === ROLES (We're Hiring) === */}
      <Section className="bg-secondary">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent">
              We're Hiring
            </span>
            <h2 className="font-display text-4xl md:text-6xl leading-tight">
              Join the <span className="text-accent">Movement</span>
            </h2>
          </div>

          {/* Role Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {!loading && roles?.map((role: Role) => (
              <div
                key={role.id}
                className="group bg-background p-8 space-y-4 hover:shadow-lg transition-all cursor-pointer"
              >
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  {role.category}
                </span>
                <h3 className="font-display text-2xl leading-tight">
                  {role.title}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {role.description}
                </p>
                <Button
                  variant="ghost"
                  className="group-hover:translate-x-2 transition-transform"
                >
                  Apply Now →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* === PRODUCTS === */}
      <Section className="bg-background">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent">
              Our Collection
            </span>
            <h2 className="font-display text-4xl md:text-6xl leading-tight">
              Luxury <span className="text-accent">Chess Pieces</span>
            </h2>
          </div>

          {/* Product Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {!loading && products?.map((product: any) => (
              <div key={product.id} className="space-y-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
                <h3 className="font-display text-xl">{product.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {product.description}
                </p>
                <p className="font-display text-lg">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* === STORIES === */}
      <Section className="bg-secondary">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent">
              Stories
            </span>
            <h2 className="font-display text-4xl md:text-6xl leading-tight">
              Deeper Than <span className="text-accent">The Board</span>
            </h2>
          </div>

          {/* Story Cards */}
          <div className="grid md:grid-cols-2 gap-12">
            {!loading && stories?.map((story: any) => (
              <div key={story.id} className="space-y-6">
                {story.imageUrl && (
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full aspect-video object-cover"
                  />
                )}
                <div className="space-y-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                    By {story.author}
                  </p>
                  <h3 className="font-display text-3xl leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-muted-foreground font-light">
                    {story.excerpt}
                  </p>
                  <Button variant="ghost">Read Full Story →</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* === APPLICATION FORM === */}
      <Section className="bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16 text-center space-y-4">
            <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent">
              Apply Now
            </span>
            <h2 className="font-display text-4xl md:text-6xl leading-tight">
              Apply for <span className="text-accent">Your Role</span>
            </h2>
          </div>
          <div className="bg-card p-8 md:p-12 space-y-6 max-w-2xl mx-auto">
            <p className="text-muted-foreground">
              Interested in joining our team? Submit your application below.
            </p>
            <form className="space-y-4">
              <select 
                className="w-full px-4 py-2 border border-input rounded-md bg-background"
                defaultValue=""
              >
                <option value="">Select a role</option>
                {roles?.map((role: Role) => (
                  <option key={role.id} value={role.id}>
                    {role.title}
                  </option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full px-4 py-2 border border-input rounded-md bg-background"
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full px-4 py-2 border border-input rounded-md bg-background"
              />
              <textarea 
                placeholder="Tell us about yourself..."
                rows={6}
                className="w-full px-4 py-2 border border-input rounded-md bg-background"
              />
              <Button className="w-full">Submit Application</Button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
}
