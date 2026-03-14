const Hero = () =>
<section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-background">
    {/* BG Image */}
    <div className="absolute inset-0 z-0">
      <img
      src="https://images.unsplash.com/photo-1578844541663-4711efaf3eb1?auto=format&fit=crop&q=80&w=1920"
      className="w-full h-full object-cover opacity-20"
      alt="Neumáticos de fondo"
      loading="lazy" />
    
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent bg-[#ffaa00]" />
    </div>

    {/* Red Diagonal */}
    <div
    className="absolute right-0 top-0 h-full w-1/3 hidden lg:block bg-[#d4740c]"
    style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }} />
  

    <div className="container mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center py-24 lg:py-0">
      <div className="space-y-8">
        {/* Tag */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ffea05]" />
          </span>
          <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Stock disponible hoy</span>
        </div>

        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-foreground uppercase italic font-black tracking-tight">
          Tu Cubierta <br />
          <span className="bg-[#d4740c] text-black">Perfecta,</span> <br />
          Hoy mismo
        </h1>

        <p className="text-muted-foreground text-lg max-w-md font-body">
          Distribuidor oficial de las mejores marcas. Envíos a todo el país desde nuestras plantas en Pilar y Hurlingham.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
          href="#presupuesto"
          className="inline-flex items-center justify-center text-primary-foreground px-8 py-4 font-bold uppercase tracking-tight transition-all hover:-translate-y-1 shadow-[0_10px_20px_rgba(200,16,46,0.2)] text-center bg-[#d4740c]">
          
            💬 Pedir Presupuesto
          </a>
          <a
          href="#catalogo"
          className="inline-flex items-center justify-center border border-foreground/20 hover:border-foreground text-foreground px-8 py-4 font-bold uppercase tracking-tight transition-all hover:-translate-y-1 text-center">
          
            📋 Ver Catálogo
          </a>
        </div>
      </div>

      {/* Right image */}
      <div className="relative hidden lg:block">
        <img
        src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
        className="w-full h-[520px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
        alt="Neumáticos de alta calidad"
        loading="lazy" />
      
        <div className="absolute -bottom-6 -left-6 bg-foreground p-6 shadow-2xl">
          <p className="text-background font-display text-4xl font-black italic leading-none">15% OFF</p>
          <p className="text-background/60 text-xs font-bold uppercase">Pago Contado</p>
        </div>
      </div>
    </div>

    {/* Stats bar */}
    <div className="absolute bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur border-t border-border z-10">
      <div className="container mx-auto py-4 grid grid-cols-3 text-center">
        {[
      { value: "2", label: "Sucursales" },
      { value: "+500", label: "Modelos" },
      { value: "24h", label: "Envío express" }].
      map((s) =>
      <div key={s.label}>
            <span className="font-display text-2xl md:text-3xl font-black text-[#d4740c]">{s.value}</span>
            <span className="block text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</span>
          </div>
      )}
      </div>
    </div>
  </section>;


export default Hero;