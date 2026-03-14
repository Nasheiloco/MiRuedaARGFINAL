import { useState, type FormEvent } from "react";
import { buildWhatsAppUrl, BRANCHES } from "@/lib/constants";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = `Hola Mi Rueda! Soy ${form.name} (${form.email}). ${form.message}`;
    window.open(buildWhatsAppUrl(text), "_blank");
  };

  const inputClass =
  "w-full bg-secondary border border-border text-foreground px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground";

  return (
    <section id="contacto" className="bg-secondary py-20 md:py-28">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-bold tracking-widest uppercase text-[#d4740c]">Contacto</span>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase italic text-foreground mt-2">
            Hablemos
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold uppercase text-foreground flex items-center gap-2">
                  📍 Direcciones
                </h3>
                {BRANCHES.map((b) =>
                <p key={b.name} className="text-muted-foreground text-sm mt-1">{b.name}: {b.address}</p>
                )}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold uppercase text-foreground flex items-center gap-2">
                  📞 Teléfonos
                </h3>
                <div className="flex flex-col gap-1 mt-1">
                  {BRANCHES[0].phones.map((p) => (
                    <a key={p.raw} href={`tel:${p.raw}`} className="transition-colors text-sm text-primary-foreground">
                      {p.display}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold uppercase text-foreground flex items-center gap-2">
                  🕐 Horarios
                </h3>
                <p className="text-muted-foreground text-sm">Lunes a Sábado: 8:00 - 18:00</p>
                <p className="text-muted-foreground text-sm">Domingos: Cerrado</p>
              </div>
            </div>

            <a
              href={buildWhatsAppUrl("Hola Mi Rueda! Quiero más información.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-whatsapp text-whatsapp-foreground w-full sm:w-auto px-10 h-14 font-bold text-lg uppercase tracking-tight transition-all hover:brightness-110 hover:-translate-y-0.5 glow-green animate-float-whatsapp">
              
              📱 Escribinos por WhatsApp
            </a>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-background border border-border p-6 md:p-8 space-y-4">
            <input
              type="text"
              placeholder="Tu nombre"
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required />
            
            <input
              type="email"
              placeholder="Tu email"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required />
            
            <textarea
              placeholder="Tu mensaje"
              rows={5}
              className={inputClass + " resize-none"}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required />
            
            <button
              type="submit"
              className="w-full text-primary-foreground h-12 font-bold uppercase tracking-tight transition-all hover:-translate-y-0.5 glow-red bg-yellow-600 hover:bg-yellow-500">
              
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </section>);

};

export default Contact;