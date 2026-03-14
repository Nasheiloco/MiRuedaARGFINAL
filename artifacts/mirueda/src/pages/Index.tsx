import Navbar from "@/components/Navbar";
import OfferBar from "@/components/OfferBar";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import QuoteSection from "@/components/QuoteSection";
import Branches from "@/components/Branches";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <>
      <Navbar />
      <OfferBar />
      <Hero />
      <Catalog />
      <QuoteSection />
      <Branches />
      <WhyUs />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
