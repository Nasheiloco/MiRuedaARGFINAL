const items = [
  "🔥 Envíos a todo el país",
  "⚡ Cubiertas para auto y moto",
  "🏆 Mejores marcas garantizadas",
  "💳 Hasta 3 cuotas sin interés",
  "🔧 Montaje y balanceo incluido",
  "📦 Stock permanente en 2 sucursales",
];

const OfferBar = () => (
  <div className="text-primary-foreground py-2.5 text-sm font-semibold tracking-wide mt-16 md:mt-20 bg-[#d4740c] overflow-hidden">
    <div
      className="flex whitespace-nowrap"
      style={{
        animation: "ticker 22s linear infinite",
      }}
    >
      {[...items, ...items].map((item, i) => (
        <span key={i} className="flex items-center gap-6 px-8">
          {item}
          <span className="opacity-50">|</span>
        </span>
      ))}
    </div>

    <style>{`
      @keyframes ticker {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

export default OfferBar;
