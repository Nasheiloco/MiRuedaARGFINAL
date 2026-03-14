import { useState, type FormEvent } from "react";
import { sendQuote } from "@/lib/constants";

const features = [
{ icon: "⚡", title: "Respuesta inmediata", desc: "Te respondemos en minutos por WhatsApp." },
{ icon: "💰", title: "Precio justo", desc: "Precios competitivos sin intermediarios." },
{ icon: "🚚", title: "Envío rápido", desc: "Despacho en 24hs para CABA e INTERIOR del pais." },
{ icon: "🛡️", title: "Garantía oficial", desc: "Todas nuestras cubiertas con garantía del local." }];


const QuoteSection = () => {
  const [form, setForm] = useState({
    name: "",
    vehicle: "",
    size: "",
    brand: "",
    branch: "",
    message: ""
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.vehicle || !form.size || !form.branch) return;
    sendQuote(form);
  };

  const inputClass =
  "w-full bg-secondary border border-border text-foreground px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground";
  const selectClass =
  "w-full bg-secondary border border-border text-foreground px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors appearance-none";

  return (
    <section id="presupuesto" className="bg-background py-20 md:py-28">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-bold tracking-widest uppercase text-[#d4740c]">Presupuesto Express</span>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase italic text-foreground mt-2">
            Cotizá en segundos
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Features */}
          <div className="space-y-6">
            {features.map((f) =>
            <div key={f.title} className="flex gap-4 items-start">
                <div className="w-12 h-12 flex items-center justify-center text-2xl shrink-0 bg-[#ffe500]/[0.32]">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              </div>
            )}

            <div className="bg-card border border-border p-6 mt-8">
              <p className="text-muted-foreground text-sm leading-relaxed">
                💡 <strong className="text-foreground">¿No sabés la medida?</strong> No te preocupes. Envianos una
                foto de tu cubierta actual y te asesoramos al instante.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card border border-border p-6 md:p-8 space-y-4">
            <input
              type="text"
              placeholder="Tu nombre"
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required />
            
            <select
              className={selectClass}
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              required>
              
              <option value="">Tipo de vehículo</option>
              <option value="Auto">Auto</option>
              <option value="Moto">Moto</option>
              <option value="Camioneta">Camioneta</option>
            </select>
            <input
              type="text"
              placeholder="Medida de cubierta (ej: 185/65 R15)"
              className={inputClass}
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              required />
            
            <input
              type="text"
              placeholder="Marca preferida (opcional)"
              className={inputClass}
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            
            <select
              className={selectClass}
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              required>
              
              <option value="">Sucursal preferida</option>
              <option value="Pilar">Pilar</option>
              <option value="Hurlingham">Hurlingham</option>
            </select>
            <textarea
              placeholder="Mensaje adicional (opcional)"
              rows={3}
              className={inputClass + " resize-none"}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })} />
            
            <button
              type="submit"
              className="w-full bg-whatsapp text-whatsapp-foreground h-14 font-bold text-base uppercase tracking-tight transition-all hover:brightness-110 hover:-translate-y-0.5 glow-green flex items-center justify-center gap-2">
              
              📱 Enviar por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>);

};

export default QuoteSection;