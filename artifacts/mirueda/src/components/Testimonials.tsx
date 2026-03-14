import { useState } from "react";
import { useListReviews, useCreateReview } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListReviewsQueryKey } from "@workspace/api-client-react";

const StarSelector = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className={`text-2xl transition-colors ${s <= value ? "text-yellow-400" : "text-muted-foreground"}`}
      >
        ★
      </button>
    ))}
  </div>
);

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`${s <= rating ? "text-yellow-400" : "text-muted-foreground"}`}>★</span>
    ))}
  </div>
);

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const Testimonials = () => {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useListReviews();
  const { mutate: submitReview, isPending } = useCreateReview({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
        setForm({ name: "", location: "", vehicle: "", text: "", rating: 5 });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
      },
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", vehicle: "", text: "", rating: 5 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.vehicle || !form.text) return;
    submitReview({ data: form });
  };

  return (
    <section id="opiniones" className="bg-card py-20 md:py-28">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-bold tracking-widest uppercase text-[#d4740c]">Opiniones</span>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase italic text-foreground mt-2">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        {/* Reviews grid */}
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Cargando opiniones...</div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {reviews.map((t) => (
              <div key={t.id} className="bg-background border border-border p-6 flex flex-col">
                <StarDisplay rating={t.rating} />
                <p className="text-muted-foreground text-sm italic leading-relaxed flex-1 mt-4">"{t.text}"</p>
                <div className="border-t border-border mt-6 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#d4740c] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="text-foreground font-bold text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {t.location} · {t.vehicle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mb-12">Todavía no hay opiniones. ¡Sé el primero!</p>
        )}

        {/* CTA to open form */}
        {!showForm && !submitted && (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-[#d4740c] text-white px-8 py-4 font-bold uppercase tracking-tight hover:brightness-110 transition-all"
            >
              ✍️ Dejar mi opinión
            </button>
          </div>
        )}

        {/* Success message */}
        {submitted && (
          <div className="max-w-lg mx-auto text-center bg-green-900/30 border border-green-600/40 p-6">
            <p className="text-green-400 font-bold text-lg">¡Gracias por tu opinión! 🎉</p>
            <p className="text-muted-foreground text-sm mt-1">Ya aparece en la sección de opiniones.</p>
          </div>
        )}

        {/* Review form */}
        {showForm && !submitted && (
          <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-background border border-border p-8 space-y-5"
          >
            <h3 className="font-display text-2xl font-bold uppercase text-foreground">Tu opinión</h3>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Calificación</label>
              <StarSelector value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Tu nombre *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Martín García"
                  className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4740c]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Localidad *</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Ej: Pilar"
                  className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4740c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Vehículo *</label>
              <input
                type="text"
                required
                value={form.vehicle}
                onChange={(e) => setForm((f) => ({ ...f, vehicle: e.target.value }))}
                placeholder="Ej: Toyota Hilux, Honda CB190..."
                className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4740c]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Tu opinión *</label>
              <textarea
                required
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                placeholder="Contanos tu experiencia con Mi Rueda..."
                rows={4}
                className="w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#d4740c] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[#d4740c] text-white py-3 font-bold uppercase tracking-tight hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isPending ? "Enviando..." : "Publicar opinión"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all font-bold uppercase text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
