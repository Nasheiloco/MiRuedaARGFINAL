import { useNavigate } from "react-router-dom";

const categories = [
  { icon: "🚗", title: "Cubiertas Autos", desc: "Las mejores marcas nacionales e importadas para tu auto. Todas las medidas disponibles.", slug: "auto" },
  { icon: "🏍️", title: "Cubiertas Motos", desc: "Cubiertas deportivas, touring y urbanas. Marcas líderes con stock permanente.", slug: "moto" },
  { icon: "🔩", title: "Llantas y Aros", desc: "Llantas de aleación y acero. Diseños exclusivos para personalizar tu vehículo.", slug: "llanta" },
  { icon: "🔧", title: "Servicio Técnico", desc: "Montaje, balanceo y alineación. Técnicos especializados en ambas sucursales.", slug: null },
  { icon: "🚚", title: "Envíos Nacionales", desc: "Despachamos a todo el país. Envío express en 24hs para CABA e INTERIOR del pais.", slug: null },
  { icon: "💳", title: "Financiación", desc: "Hasta 3 cuotas sin interés con tarjetas seleccionadas. Consultá promociones vigentes.", slug: null },
];

const Catalog = () => {
  const navigate = useNavigate();

  return (
    <section id="catalogo" className="bg-card py-20 md:py-28">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-bold tracking-widest uppercase text-[#d4740c]">Catálogo</span>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase italic text-foreground mt-2">
            Nuestros Productos
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div
              key={c.title}
              onClick={() => c.slug && navigate(`/catalogo?category=${c.slug}`)}
              className={`group relative bg-background p-8 border border-border overflow-hidden transition-all hover:bg-secondary ${c.slug ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-[#d4740c]" />

              <div className="w-12 h-12 flex items-center justify-center mb-6 text-2xl bg-[#d40c2a]/[0.19]">
                {c.icon}
              </div>

              <h3 className="font-display text-2xl text-foreground uppercase mb-3 italic font-bold">{c.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{c.desc}</p>

              {c.slug && (
                <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all text-[#d4740c]">
                  Ver catálogo <span className="text-lg">→</span>
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <a
            href="#presupuesto"
            className="inline-flex items-center justify-center text-white px-8 h-12 font-bold uppercase tracking-tight transition-all hover:-translate-y-0.5 bg-[#d4740c]"
          >
            💬 Pedir Presupuesto
          </a>
          <a
            href="https://wa.me/541170040533?text=Hola%20Mi%20Rueda!%20Quiero%20ver%20el%20catálogo%20completo."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-whatsapp text-whatsapp-foreground px-8 h-12 font-bold uppercase tracking-tight transition-all hover:brightness-110 hover:-translate-y-0.5"
          >
            📱 Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Catalog;
