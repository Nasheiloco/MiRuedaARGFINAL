import { buildWhatsAppUrl } from "@/lib/constants";

const Footer = () =>
<footer className="bg-background border-t border-border">
    <div className="container mx-auto py-12 md:py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <div>
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="MR Neumáticos"
              className="h-24 w-auto object-contain"
            />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Distribuidor oficial de cubiertas y llantas. Más de 10 años equipando vehículos en el Gran Buenos Aires.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com/mirueda.arg" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              📸 @mirueda.arg
            </a>
            <a href="https://tiktok.com/@miruedaarg" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              🎵 @miruedaarg
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-widest text-foreground mb-4">Links rápidos</h4>
          <ul className="space-y-2">
            {["Inicio", "Catálogo", "Presupuesto", "Sucursales", "Contacto"].map((l) =>
          <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  {l}
                </a>
              </li>
          )}
          </ul>
        </div>

        {/* Sucursales */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-widest text-foreground mb-4">Sucursales</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="text-foreground font-semibold">Pilar</p>
              <p>Miguel Soler 1035</p>
            </div>
            <div>
              <p className="text-foreground font-semibold">Hurlingham</p>
              <p>Gob. Vergara 2643</p>
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-widest text-foreground mb-4">Horarios</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Lunes a Sábado</p>
            <p className="text-foreground font-semibold">8:00 - 18:00</p>
            <p className="mt-3">Domingos</p>
            <p className="text-foreground font-semibold">Cerrado</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Gomería Mi Rueda. Todos los derechos reservados.
        </p>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          🚚 Envíos a todo el país
        </span>
      </div>
    </div>
  </footer>;


export default Footer;