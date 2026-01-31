"use client";

import { Navbar } from "@/components/Navbar";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { type Role } from "@shared/schema";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";

export default function Home() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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

        setRoles(Array.isArray(rolesData) ? rolesData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setStories(Array.isArray(storiesData) ? storiesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setRolesLoading(false);
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
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src={HERO_IMAGE}
            alt="Chess Vision"
            className="w-full h-full object-cover grayscale opacity-90"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center text-white space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none"
          >
            BIGGER THAN
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
              CHESS.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="font-serif-italic text-xl md:text-2xl text-white/80 max-w-2xl mx-auto"
          >
            We are building the world's most significant chess company.
            <br />
            And telling deeply human stories along the way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <Button
              onClick={() =>
                document
                  .getElementById("ecosystem")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              variant="outline"
              className="bg-transparent text-white border-white/30 hover:bg-white hover:text-black rounded-none px-8 py-6 text-lg tracking-widest uppercase transition-all duration-500"
            >
              Explore the Vision
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* === MANIFESTO === */}
      <Section id="manifesto" className="bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent"
          >
            The Vision
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl leading-tight"
          >
            Chess is not just a game. <br />
            It is a language of{" "}
            <span className="font-serif-italic text-accent">intellect</span> and{" "}
            <span className="font-serif-italic text-accent">war</span>.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="prose prose-lg md:prose-xl mx-auto text-muted-foreground font-light leading-relaxed"
          >
            <p>
              We believe the chess world has been stagnant for too long. We are
              here to disrupt it with luxury, storytelling, and technology. We're
              creating an ecosystem that bridges the gap between the grandmaster
              and the artist, the player and the collector.
            </p>
            <p>This isn't about selling boards. It's about selling a legacy.</p>
          </motion.div>
        </div>
      </Section>

      {/* === ECOSYSTEM (PRODUCTS) === */}
      <Section id="ecosystem" className="bg-primary text-primary-foreground py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8"
          >
            <div>
              <span className="block text-xs font-bold tracking-[0.3em] uppercase text-accent mb-4">
                The Ecosystem
              </span>
              <h2 className="font-display text-4xl md:text-5xl">
                Artifacts of Power
              </h2>
            </div>
            <p className="font-serif-italic text-white/60 text-right mt-4 md:mt-0 max-w-sm">
              Luxury boards, curated merchandise, and digital experiences
              designed for the modern strategist.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-white/5">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute bottom-0 left-0 p-6 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="bg-white text-black px-4 py-2 text-sm font-bold uppercase tracking-wider">
                      {(product.price / 100).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-display group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-white/50 mt-2 font-light">
                  {product.category}
                </p>
              </motion.div>
            ))}

            {!products?.length && (
              <div className="col-span-full py-20 text-center border border-white/10">
                <p className="text-white/30 font-display text-xl uppercase tracking-widest">
                  Collection launching soon
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* === STORIES === */}
      <Section id="stories" className="bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="block text-xs font-bold tracking-[0.3em] uppercase text-accent mb-4">
              The Human Element
            </span>
            <h2 className="font-display text-4xl md:text-6xl text-primary">
              Deeply Human Stories
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            {stories?.map((story, idx) => (
              <motion.article
                key={story.id}
                className={`flex flex-col ${idx % 2 === 1 ? "md:mt-32" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="aspect-[16/10] overflow-hidden mb-8">
                  <img
                    src={
                      story.imageUrl ||
                      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071"
                    }
                    alt={story.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-muted-foreground/20 pb-2 inline-block">
                    {new Date().toLocaleDateString()} — By {story.author}
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl leading-tight hover:text-accent transition-colors cursor-pointer">
                    {story.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed font-serif-italic">
                    {story.excerpt}
                  </p>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-primary hover:text-accent group uppercase tracking-widest text-sm font-bold mt-4"
                  >
                    Read Story{" "}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.article>
            ))}

            {!stories?.length && (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground italic">
                  Stories are being written...
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* === JOIN US (CAREERS) === */}
      <Section
        id="careers"
        className="bg-primary text-primary-foreground min-h-[80vh] flex items-center"
      >
        <div className="max-w-5xl mx-auto px-6 w-full">
          <div className="mb-16">
            <span className="block text-xs font-bold tracking-[0.3em] uppercase text-accent mb-4">
              Join the Team
            </span>
            <h2 className="font-display text-5xl md:text-7xl mb-6">
              Build the Legacy
            </h2>
            <p className="text-xl text-white/60 max-w-2xl font-light">
              We are looking for high-agency, emotionally grounded, and
              exceptionally smart individuals to shape this vision.
            </p>
          </div>

          <div className="grid gap-4">
            {rolesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : roles?.map((role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group border border-white/10 hover:border-accent bg-white/5 hover:bg-white/10 p-8 transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                onClick={() => setSelectedRole(role)}
              >
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                      {role.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display mb-2">{role.title}</h3>
                  <p className="text-white/60 font-light">{role.description}</p>
                </div>
                <div className="shrink-0">
                  <Button
                    variant="outline"
                    className="rounded-none border-white/20 text-white hover:bg-accent hover:text-black hover:border-accent w-full md:w-auto uppercase tracking-widest"
                  >
                    Apply Now
                  </Button>
                </div>
              </motion.div>
            ))}

            {!roles?.length && !rolesLoading && (
              <div className="p-12 text-center border border-white/10 text-white/40 italic">
                No open positions at the moment.
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-display text-2xl tracking-tighter">
            BIGGER THAN CHESS.
          </span>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Application Form Drawer/Modal */}
      {selectedRole && (
        <ApplicationForm
          role={selectedRole}
          isOpen={!!selectedRole}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </div>
  );
}
