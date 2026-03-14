import { useState, useEffect } from "react";
import { buildWhatsAppUrl } from "@/lib/constants";

const navLinks = [
{ label: "Inicio", href: "#inicio" },
{ label: "Catálogo", href: "#catalogo" },
{ label: "Presupuesto", href: "#presupuesto" },
{ label: "Sucursales", href: "#sucursales" },
{ label: "Contacto", href: "#contacto" }];


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"}`
      }>
      
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="#inicio" className="flex items-center">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="MR Neumáticos"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) =>
          <a
            key={l.href}
            href={l.href}
            className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
            
              {l.label}
            </a>
          )}
        </div>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-4">
          <a
            href={buildWhatsAppUrl("Hola Mi Rueda! Quiero más información.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-whatsapp text-whatsapp-foreground px-5 h-10 font-bold text-sm uppercase tracking-tight hover:brightness-110 transition-all">
            
            💬 WhatsApp
          </a>

          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú">
            
            <span className={`block w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-foreground transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen &&
      <div className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-border">
          <div className="container mx-auto py-6 flex flex-col gap-4">
            {navLinks.map((l) =>
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            className="text-lg font-display font-bold uppercase text-foreground hover:text-primary transition-colors">
            
                {l.label}
              </a>
          )}
            <a
            href={buildWhatsAppUrl("Hola Mi Rueda! Quiero más información.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-whatsapp text-whatsapp-foreground px-5 h-12 font-bold text-sm uppercase tracking-tight mt-2">
            
              💬 WhatsApp
            </a>
          </div>
        </div>
      }
    </nav>);

};

export default Navbar;