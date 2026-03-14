import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useListProducts } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListProductsQueryKey } from "@workspace/api-client-react";
import { buildWhatsAppUrl } from "@/lib/constants";

type Category = "todos" | "auto" | "moto" | "llanta";
type ProductCategory = "auto" | "moto" | "llanta";

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

const emptyForm = {
  name: "",
  brand: "",
  category: "auto" as ProductCategory,
  size: "",
  price: "",
  description: "",
  imageUrl: "",
  inStock: true,
};

const BASE = import.meta.env.BASE_URL;

async function apiCall(path: string, method: string, token: string, body?: unknown) {
  const res = await fetch(`${BASE}api/${path}`, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error");
  return data;
}

async function uploadImage(file: File, token: string): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`${BASE}api/upload`, {
    method: "POST",
    headers: { "x-admin-token": token },
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al subir imagen");
  return data.url as string;
}

interface ProductRow {
  id: number;
  name: string;
  brand: string;
  category: ProductCategory;
  size: string;
  price: string | number | null;
  description: string | null;
  imageUrl: string | null;
  inStock: boolean;
}

export default function Catalogo() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") as Category | null;
  const [activeCategory, setActiveCategory] = useState<Category>(
    urlCategory && ["auto", "moto", "llanta"].includes(urlCategory)
      ? urlCategory
      : "todos"
  );
  const [searchBrand, setSearchBrand] = useState("");

  // --- Admin state ---
  const [adminToken, setAdminToken] = useState<string | null>(
    sessionStorage.getItem("adminToken")
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPwd, setLoginPwd] = useState("");
  const [loginError, setLoginError] = useState("");

  // --- Product form state ---
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cat = searchParams.get("category") as Category | null;
    if (cat && ["auto", "moto", "llanta"].includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat);
    if (cat === "todos") setSearchParams({});
    else setSearchParams({ category: cat });
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

  // --- Admin login ---
  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch(`${BASE}api/admin/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: loginPwd }),
    });
    if (res.ok) {
      sessionStorage.setItem("adminToken", loginPwd);
      setAdminToken(loginPwd);
      setShowLoginModal(false);
      setLoginPwd("");
    } else {
      setLoginError("Contraseña incorrecta");
    }
  }

  function logout() {
    sessionStorage.removeItem("adminToken");
    setAdminToken(null);
  }

  // --- Product form helpers ---
  function openNew() {
    setEditProduct(null);
    setForm({ ...emptyForm, category: activeCategory !== "todos" ? activeCategory : "auto" });
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setShowForm(true);
  }

  function openEdit(p: ProductRow) {
    setEditProduct(p);
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      size: p.size,
      price: p.price != null ? String(p.price) : "",
      description: p.description ?? "",
      imageUrl: p.imageUrl ?? "",
      inStock: p.inStock,
    });
    setImageFile(null);
    setImagePreview(p.imageUrl ?? "");
    setFormError("");
    setShowForm(true);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!adminToken) return;
    setSaving(true);
    setFormError("");
    try {
      let finalImageUrl = form.imageUrl || null;
      if (imageFile) finalImageUrl = await uploadImage(imageFile, adminToken);

      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        size: form.size,
        price: form.price !== "" ? Number(form.price) : null,
        description: form.description || null,
        imageUrl: finalImageUrl,
        inStock: form.inStock,
      };

      if (editProduct) {
        await apiCall(`products/${editProduct.id}`, "PUT", adminToken, payload);
      } else {
        await apiCall("products", "POST", adminToken, payload);
      }
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!adminToken) return;
    if (!confirm("¿Eliminar esta cubierta?")) return;
    await apiCall(`products/${id}`, "DELETE", adminToken, undefined);
    queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
  }

  const inputClass =
    "w-full bg-secondary border border-border text-foreground px-4 py-2.5 text-sm font-body focus:outline-none focus:border-[#d4740c] transition-colors placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
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
          <div className="flex items-center gap-3">
            {adminToken ? (
              <>
                <button
                  onClick={openNew}
                  className="bg-[#d4740c] text-white px-4 h-9 font-bold text-xs uppercase tracking-wide hover:brightness-110 transition-all"
                >
                  + Agregar cubierta
                </button>
                <button
                  onClick={logout}
                  className="text-xs text-muted-foreground hover:text-foreground border border-border px-3 h-9 transition-colors font-bold uppercase"
                  title="Salir del modo admin"
                >
                  🔓 Salir
                </button>
              </>
            ) : (
              <>
                <a
                  href={buildWhatsAppUrl("Hola Mi Rueda! Quiero consultar por el catálogo.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold bg-whatsapp text-whatsapp-foreground px-4 h-9 flex items-center gap-2 hover:brightness-110 transition-all"
                >
                  📱 WhatsApp
                </a>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2"
                  title="Acceso administrador"
                >
                  🔒
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <span className="text-sm font-bold tracking-widest uppercase text-[#d4740c]">
              {adminToken ? "Modo Administrador" : "Stock disponible"}
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
          {adminToken && (
            <button
              onClick={openNew}
              className="bg-[#d4740c] text-white px-6 h-12 font-bold uppercase tracking-tight text-sm hover:brightness-110 transition-all"
            >
              + Nueva cubierta
            </button>
          )}
        </div>

        {/* FILTERS */}
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
            <p className="text-muted-foreground font-body text-lg mb-6">
              {adminToken
                ? "No hay productos todavía. ¡Agregá el primero!"
                : "No hay productos publicados todavía en esta categoría."}
            </p>
            {adminToken ? (
              <button
                onClick={openNew}
                className="inline-flex items-center gap-2 bg-[#d4740c] text-white px-8 h-12 font-bold uppercase tracking-tight hover:brightness-110 transition-all"
              >
                + Agregar cubierta
              </button>
            ) : (
              <a
                href={buildWhatsAppUrl("Hola Mi Rueda! Quiero consultar disponibilidad.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-whatsapp text-whatsapp-foreground px-8 h-12 font-bold uppercase tracking-tight hover:brightness-110 transition-all"
              >
                📱 Consultar por WhatsApp
              </a>
            )}
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
                    src={p.imageUrl}
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
                    <span
                      className={`text-xs font-bold uppercase px-2 py-0.5 ${
                        p.inStock
                          ? "bg-green-900/30 text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.inStock ? "En stock" : "Sin stock"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                    {p.brand}
                  </p>
                  <h3 className="font-display text-xl font-black uppercase italic text-foreground mb-1">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body mb-1">
                    Medida:{" "}
                    <span className="text-foreground font-bold">{p.size}</span>
                  </p>
                  {p.description && (
                    <p className="text-xs text-muted-foreground font-body mb-3 leading-relaxed">
                      {p.description}
                    </p>
                  )}

                  <div className="mt-auto pt-4">
                    {adminToken ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(p as ProductRow)}
                          className="flex-1 border border-border text-foreground h-9 text-xs font-bold uppercase tracking-wide hover:border-[#d4740c] hover:text-[#d4740c] transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="flex-1 border border-red-800 text-red-400 h-9 text-xs font-bold uppercase tracking-wide hover:bg-red-900/20 transition-colors"
                        >
                          🗑 Eliminar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
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
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── LOGIN MODAL ── */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-sm p-8">
            <h2 className="font-display text-2xl font-black uppercase italic text-foreground mb-6 text-center">
              🔒 Acceso Admin
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña"
                value={loginPwd}
                onChange={(e) => setLoginPwd(e.target.value)}
                className={inputClass}
                autoFocus
              />
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              <button
                type="submit"
                className="w-full bg-[#d4740c] text-white h-11 font-bold uppercase tracking-tight hover:brightness-110 transition-all"
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={() => { setShowLoginModal(false); setLoginError(""); setLoginPwd(""); }}
                className="w-full border border-border text-muted-foreground h-11 font-bold uppercase tracking-tight hover:text-foreground hover:border-foreground/30 transition-all text-sm"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── PRODUCT FORM MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-xl font-black uppercase italic text-foreground">
                {editProduct ? "Editar cubierta" : "Nueva cubierta"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* FOTO */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Foto
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-border hover:border-[#d4740c] transition-colors cursor-pointer overflow-hidden"
                  style={{ minHeight: 160 }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
                      <span className="text-3xl">📷</span>
                      <span className="text-sm font-bold uppercase tracking-wide">
                        Subir foto
                      </span>
                      <span className="text-xs">JPG, PNG, WEBP — máx. 5 MB</span>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-bold uppercase">
                        📷 Cambiar foto
                      </span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      setForm((f) => ({ ...f, imageUrl: "" }));
                    }}
                    className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Quitar foto
                  </button>
                )}
              </div>

              {/* CATEGORÍA */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Categoría *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))
                  }
                  className={inputClass}
                  required
                >
                  <option value="auto">Cubierta Auto</option>
                  <option value="moto">Cubierta Moto</option>
                  <option value="llanta">Llanta / Aro</option>
                </select>
              </div>

              {/* MARCA */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Marca *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Pirelli, Michelin, Fate..."
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>

              {/* TÍTULO */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Título / Modelo *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Scorpion ATR, Pilot Sport..."
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>

              {/* MEDIDA */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Medida *
                </label>
                <input
                  type="text"
                  placeholder="Ej: 205/55 R16, 90/90-17..."
                  value={form.size}
                  onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>

              {/* ESTADO */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Estado *
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, inStock: true }))}
                    className={`flex-1 h-11 font-bold text-sm uppercase tracking-wide border transition-all ${
                      form.inStock
                        ? "bg-green-700 border-green-700 text-white"
                        : "bg-transparent border-border text-muted-foreground hover:border-green-700"
                    }`}
                  >
                    ✓ En stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, inStock: false }))}
                    className={`flex-1 h-11 font-bold text-sm uppercase tracking-wide border transition-all ${
                      !form.inStock
                        ? "bg-muted border-muted text-foreground"
                        : "bg-transparent border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    Sin stock
                  </button>
                </div>
              </div>

              {/* PRECIO */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Precio (opcional)
                </label>
                <input
                  type="number"
                  placeholder='Ej: 85000 — dejalo vacío para mostrar "Consultar"'
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className={inputClass}
                  min={0}
                />
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-border text-foreground h-11 font-bold uppercase tracking-tight text-sm hover:border-[#d4740c] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#d4740c] text-white h-11 font-bold uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {saving
                    ? "Guardando..."
                    : editProduct
                    ? "Guardar cambios"
                    : "Publicar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
