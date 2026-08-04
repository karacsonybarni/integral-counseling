import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import AppointmentBooking from "@/components/AppointmentBooking";
import Footer from "@/components/Footer";
import { consumePendingScrollTarget, scrollToSection } from "@/lib/routing";

export default function Home() {
  useEffect(() => {
    const target = consumePendingScrollTarget();
    if (!target) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToSection(target);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <div id="about">
          <About />
        </div>
        <div id="services">
          <Services />
        </div>
        <div id="contact">
          <AppointmentBooking />
        </div>
      </main>
      <Footer />
    </div>
  );
}
