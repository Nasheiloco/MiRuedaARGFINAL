import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";

type Category = "auto" | "moto" | "llanta";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: Category;
  size: string;
  price: string | number | null;
  description: string | null;
  imageUrl: string | null;
  inStock: boolean;
  createdAt: string;
}

const CATEGORY_LABELS: Record<Category, string> = {
  auto: "Cubierta Auto",
  moto: "Cubierta Moto",
  llanta: "Llanta / Aro",
};

const emptyForm = {
  name: "",
  brand: "",
  category: "auto" as Category,
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

export default function Admin() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("adminToken"));
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (token) loadProducts();
  }, [token]);

  async function loadProducts() {
    const data = await fetch(`${BASE}api/products`).then((r) => r.json());
    setProducts(data);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch(`${BASE}api/admin/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("adminToken", password);
        setToken(password);
      } else {
        setLoginError("Contraseña incorrecta");
      }
    } catch {
      setLoginError("Error de conexión");
    }
  }

  function logout() {
    sessionStorage.removeItem("adminToken");
    setToken(null);
  }

  function openNew() {
    setEditProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setError("");
    setShowForm(true);
  }

  function openEdit(p: Product) {
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
    setError("");
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
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      let finalImageUrl = form.imageUrl || null;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile, token);
      }

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
        await apiCall(`products/${editProduct.id}`, "PUT", token, payload);
      } else {
        await apiCall("products", "POST", token, payload);
      }
      setShowForm(false);
      await loadProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!confirm("¿Eliminar este producto?")) return;
    await apiCall(`products/${id}`, "DELETE", token, undefined);
    await loadProducts();
  }

  const inputClass =
    "w-full bg-secondary border border-border text-foreground px-4 py-2.5 text-sm font-body focus:outline-none focus:border-[#d4740c] transition-colors placeholder:text-muted-foreground";

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <span className="font-display text-3xl font-black uppercase italic text-foreground">
              Mi Rueda
            </span>
            <p className="text-muted-foreground text-sm mt-1">Panel de Administración</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              autoFocus
            />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-[#d4740c] text-white h-12 font-bold uppercase tracking-tight hover:brightness-110 transition-all"
            >
              Ingresar
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
              ← Volver al sitio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Sitio
            </Link>
            <span className="font-display text-xl font-black uppercase italic text-foreground">
              Panel Admin
            </span>
          </div>
          <button onClick={logout} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-black uppercase italic text-foreground">
              Productos
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {products.length} producto{products.length !== 1 ? "s" : ""} publicado{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={openNew}
            className="bg-[#d4740c] text-white px-6 h-11 font-bold uppercase tracking-tight hover:brightness-110 transition-all text-sm"
          >
            + Agregar cubierta
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-body">
            No hay productos todavía. ¡Agregá el primero!
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-card border border-border overflow-hidden flex flex-col">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={`${p.brand} ${p.name}`}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-secondary flex items-center justify-center text-4xl">
                    {p.category === "auto" ? "🚗" : p.category === "moto" ? "🏍️" : "🔩"}
                  </div>
                )}

                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#d4740c]">
                        {CATEGORY_LABELS[p.category]}
                      </span>
                      <h3 className="font-display text-base font-black uppercase italic text-foreground leading-tight">
                        {p.brand} {p.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {p.size}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 shrink-0 ${
                        p.inStock ? "bg-green-900/30 text-green-400" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.inStock ? "En stock" : "Sin stock"}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1 mt-auto">
                    <button
                      onClick={() => openEdit(p)}
                      className="flex-1 border border-border text-foreground h-9 text-xs font-bold uppercase tracking-wide hover:border-[#d4740c] transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 border border-red-800 text-red-400 h-9 text-xs font-bold uppercase tracking-wide hover:bg-red-900/20 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                  Foto de la cubierta
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
                      <span className="text-white text-sm font-bold uppercase tracking-wide">
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
                    onClick={() => { setImageFile(null); setImagePreview(""); setForm(f => ({ ...f, imageUrl: "" })); }}
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
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
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

              {/* TÍTULO / MODELO */}
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
                  Estado de la cubierta *
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

              {/* PRECIO (opcional) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Precio (opcional)
                </label>
                <input
                  type="number"
                  placeholder="Ej: 85000 — dejalo vacío para mostrar &quot;Consultar&quot;"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className={inputClass}
                  min={0}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

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
                  {saving ? "Guardando..." : editProduct ? "Guardar cambios" : "Publicar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
