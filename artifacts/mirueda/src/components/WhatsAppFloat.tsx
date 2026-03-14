import { buildWhatsAppUrl } from "@/lib/constants";

const WhatsAppFloat = () => (
  <a
    href={buildWhatsAppUrl("Hola Mi Rueda! Quiero más información.")}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center text-2xl shadow-lg glow-green animate-float-whatsapp hover:scale-110 transition-transform"
    aria-label="WhatsApp"
  >
    📱
  </a>
);

export default WhatsAppFloat;
