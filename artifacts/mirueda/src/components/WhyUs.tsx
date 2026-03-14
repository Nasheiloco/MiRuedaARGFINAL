const reasons = [
{ num: "01", title: "Precios competitivos", desc: "Trabajamos directo con fábricas para ofrecerte el mejor precio del mercado." },
{ num: "02", title: "Stock permanente", desc: "Más de 500 modelos disponibles en ambas sucursales para entrega inmediata." },
{ num: "03", title: "Asesoramiento experto", desc: "Técnicos especializados que te guían para elegir la cubierta ideal." },
{ num: "04", title: "Garantía oficial", desc: "Todas las cubiertas con garantía de nuestra parte y respaldo de las mejores marcas." }];


const WhyUs = () =>
<section className="bg-background py-20 md:py-28">
    <div className="container mx-auto">
      <div className="text-center mb-14">
        <span className="text-sm font-bold tracking-widest uppercase text-[#d4740c]">Confianza</span>
        <h2 className="font-display text-4xl md:text-5xl font-black uppercase italic text-foreground mt-2">
          ¿Por qué elegirnos?
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {reasons.map((r) =>
      <div key={r.num} className="relative bg-card border border-border p-8 overflow-hidden group hover:bg-secondary transition-colors">
            {/* Big Number */}
            <span className="absolute top-4 right-4 font-display text-7xl font-black italic leading-none select-none text-[#d4740c]/[0.28]">
              {r.num}
            </span>
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-bold uppercase text-foreground mb-2">{r.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
            </div>
          </div>
      )}
      </div>

      {/* Highlight block */}
      <div className="relative overflow-hidden bg-black/0 border-2 border-primary-foreground">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block">
          <img
          src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600"
          alt="Taller mecánico"
          className="w-full h-full opacity-30 object-cover"
          loading="lazy" />
        
        </div>
        <div className="relative z-10 p-8 md:p-12 max-w-2xl bg-[#d4740c] border-[#f10404]">
          <h3 className="font-display text-3xl md:text-4xl font-black uppercase italic text-primary-foreground">
            Más de 10 años equipando vehículos en el GBA
          </h3>
          <p className="text-primary-foreground/80 mt-4 text-lg">
            Dos sucursales, un equipo experto y la confianza de miles de clientes.
          </p>
        </div>
      </div>
    </div>
  </section>;


export default WhyUs;