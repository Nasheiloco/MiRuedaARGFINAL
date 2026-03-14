import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useListProducts } from "@workspace/api-client-react";
import { buildWhatsAppUrl } from "@/lib/constants";

type Category = "todos" | "auto" | "moto" | "llanta";

const CATEGORY_LABELS: Record<string, string> = {
  auto: "Cubierta Auto",
  moto: "Cubierta Moto",
  llanta: "Llanta / Aro",
};

const categoryTabs: { value: Category; label: string }[] = [
  { value: "todos", label: "Todo" },
  { value: "auto", label: "Cubiertas Auto" },
  { value: "moto", label: "Cubiertas Moto" },
  { value: "llanta", label: "Llantas y Aros" },
];

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") as Category | null;
  const [activeCategory, setActiveCategory] = useState<Category>(
    urlCategory && ["auto", "moto", "llanta"].includes(urlCategory) ? urlCategory : "todos"
  );
  const [searchBrand, setSearchBrand] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category") as Category | null;
    if (cat && ["auto", "moto", "llanta"].includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat);
    if (cat === "todos") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  }

  const { data: products = [], isLoading } = useListProducts(
    activeCategory !== "todos" ? { category: activeCategory } : {}
  );

  const filtered = searchBrand.trim()
    ? products.filter((p) =>
        p.brand.toLowerCase().includes(searchBrand.toLowerCase())
      )
    : products;

  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

  const whatsappProduct = (p: { name: string; brand: string; size: string }) =>
    buildWhatsAppUrl(
      `Hola Mi Rueda! Me interesa: ${p.brand} ${p.name} ${p.size}. ¿Tienen stock y precio?`
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="font-display text-xl font-black uppercase italic text-foreground hover:text-[#d4740c] transition-colors"
          >
            ← Mi Rueda
          </Link>
          <span className="font-display text-2xl font-black uppercase italic text-foreground hidden sm:block">
            Catálogo
          </span>
          <a
            href={buildWhatsAppUrl("Hola Mi Rueda! Quiero consultar por el catálogo.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold bg-whatsapp text-whatsapp-foreground px-4 h-9 flex items-center gap-2 hover:brightness-110 transition-all"
          >
            📱 WhatsApp
          </a>
        </div>
      </header>

      <div className="container mx-auto py-10">
        <div className="mb-8">
          <span className="text-sm font-bold tracking-widest uppercase text-[#d4740c]">
            Stock disponible
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase italic text-foreground mt-1">
            {activeCategory === "todos"
              ? "Nuestro Catálogo"
              : activeCategory === "auto"
              ? "Cubiertas Auto"
              : activeCategory === "moto"
              ? "Cubiertas Moto"
              : "Llantas y Aros"}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleCategoryChange(tab.value)}
                className={`px-4 h-10 font-bold text-sm uppercase tracking-wide border transition-all ${
                  activeCategory === tab.value
                    ? "bg-[#d4740c] border-[#d4740c] text-white"
                    : "bg-transparent border-border text-muted-foreground hover:border-[#d4740c] hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {brands.length > 0 && (
            <select
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              className="bg-secondary border border-border text-foreground px-3 h-10 text-sm font-body focus:outline-none focus:border-[#d4740c] transition-colors"
            >
              <option value="">Todas las marcas</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-20 text-muted-foreground font-body">
            Cargando productos...
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body text-lg mb-4">
              No hay productos publicados todavía en esta categoría.
            </p>
            <a
              href={buildWhatsAppUrl("Hola Mi Rueda! Quiero consultar disponibilidad.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp text-whatsapp-foreground px-8 h-12 font-bold uppercase tracking-tight hover:brightness-110 transition-all"
            >
              📱 Consultar por WhatsApp
            </a>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="group bg-card border border-border overflow-hidden flex flex-col hover:border-[#d4740c] transition-colors"
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl.startsWith("/uploads/") ? p.imageUrl : p.imageUrl}
                    alt={`${p.brand} ${p.name}`}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-secondary flex items-center justify-center text-5xl">
                    {p.category === "auto" ? "🚗" : p.category === "moto" ? "🏍️" : "🔩"}
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d4740c]">
                      {CATEGORY_LABELS[p.category] ?? p.category}
                    </span>
                    {!p.inStock && (
                      <span className="text-xs font-bold uppercase bg-muted text-muted-foreground px-2 py-0.5">
                        Sin stock
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                    {p.brand}
                  </p>
                  <h3 className="font-display text-xl font-black uppercase italic text-foreground mb-1">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body mb-1">
                    Medida: <span className="text-foreground font-bold">{p.size}</span>
                  </p>
                  {p.description && (
                    <p className="text-xs text-muted-foreground font-body mb-3 leading-relaxed">
                      {p.description}
                    </p>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-display text-2xl font-black text-[#d4740c]">
                      {p.price != null
                        ? `$${Number(p.price).toLocaleString("es-AR")}`
                        : "Consultar"}
                    </span>
                    <a
                      href={whatsappProduct(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold bg-whatsapp text-whatsapp-foreground px-4 h-9 flex items-center hover:brightness-110 transition-all"
                    >
                      📱 Consultar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
