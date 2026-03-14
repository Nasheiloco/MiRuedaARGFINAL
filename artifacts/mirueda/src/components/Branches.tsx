import { BRANCHES, buildWhatsAppUrl } from "@/lib/constants";

const Branches = () =>
<section id="sucursales" className="bg-secondary py-20 md:py-28">
    <div className="container mx-auto">
      <div className="text-center mb-14">
        <span className="text-sm font-bold tracking-widest uppercase text-[#d4740c]">Sucursales</span>
        <h2 className="font-display text-4xl md:text-5xl font-black uppercase italic text-foreground mt-2">
          Visitanos
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {BRANCHES.map((b) =>
      <div key={b.name} className="bg-background border border-border overflow-hidden">
            <div className="relative">
              <img
            src={b.image}
            alt={b.name}
            className="w-full h-48 object-cover"
            loading="lazy" />
          
              <span className="absolute top-4 left-4 text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 bg-[#d4740c]">
                {b.name.replace("Sucursal ", "")}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="font-display text-2xl font-bold uppercase text-foreground">{b.name}</h3>

              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2 text-muted-foreground">
                  <span>📍</span> {b.address}
                </p>
                <p className="flex items-start gap-2 text-muted-foreground">
                  <span>🕐</span> {b.hours}
                </p>
                <div className="flex items-start gap-2">
                  <span>📞</span>
                  <div className="flex flex-col gap-1">
                    {b.phones.map((p) => (
                      <a key={p.raw} href={`tel:${p.raw}`} className="transition-colors text-primary-foreground">
                        {p.display}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
              href={b.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center bg-secondary text-foreground h-10 text-sm font-bold uppercase tracking-tight border border-border hover:border-foreground/30 transition-all">
              
                  📍 Cómo llegar
                </a>
                <a
              href={buildWhatsAppUrl(`Hola! Quiero consultar en la sucursal ${b.name.replace("Sucursal ", "")}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center bg-whatsapp text-whatsapp-foreground h-10 text-sm font-bold uppercase tracking-tight hover:brightness-110 transition-all">
              
                  💬 WhatsApp
                </a>
              </div>

              {/* Map embed */}
              <div className="mt-4">
                <iframe
              src={b.mapsEmbed}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa ${b.name}`}
              className="grayscale hover:grayscale-0 transition-all duration-500" />
            
              </div>
            </div>
          </div>
      )}
      </div>
    </div>
  </section>;


export default Branches;