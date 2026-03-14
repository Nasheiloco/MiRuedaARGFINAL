const WHATSAPP_PHONE = "541170040533";

export const buildWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};

export const openWhatsApp = (message: string) => {
  window.open(buildWhatsAppUrl(message), '_blank');
};

export interface QuoteData {
  name: string;
  vehicle: string;
  size: string;
  brand: string;
  branch: string;
  message?: string;
}

export const sendQuote = (data: QuoteData) => {
  const text = `Hola Mi Rueda! Vengo de la web.
Presupuesto para: ${data.vehicle}
Medida: ${data.size}
Marca preferida: ${data.brand}
Sucursal: ${data.branch}
Nombre: ${data.name}${data.message ? `\nMensaje: ${data.message}` : ''}`;
  openWhatsApp(text);
};

export const BRANCHES = [
  {
    name: "Sucursal Pilar",
    address: "Miguel Soler 1035, Pilar",
    hours: "Lun-Sáb 8:00-18:00",
    phones: [
      { raw: "+541170040533", display: "+54 11 7004-0533" },
      { raw: "+541132659760", display: "+54 11 3265-9760" },
    ],
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Miguel Soler 1035, Pilar, Buenos Aires")}`,
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3289.5!2d-58.9!3d-34.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDI3JzAwLjAiUyA1OMKwNTQnMDAuMCJX!5e0!3m2!1ses!2sar!4v1700000000000",
    image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Sucursal Hurlingham",
    address: "Gobernador Vergara 2643, Hurlingham",
    hours: "Lun-Sáb 8:00-18:00",
    phones: [
      { raw: "+541170040533", display: "+54 11 7004-0533" },
      { raw: "+541132659760", display: "+54 11 3265-9760" },
    ],
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Gobernador Vergara 2643, Hurlingham, Buenos Aires")}`,
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.5!2d-58.6!3d-34.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzAwLjAiUyA1OMKwMzYnMDAuMCJX!5e0!3m2!1ses!2sar!4v1700000000000",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
  },
];
