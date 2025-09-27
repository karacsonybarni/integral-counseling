import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import AppointmentBooking from "@/components/AppointmentBooking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const PENDING_SCROLL_KEY = "pending-scroll-target";

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const target = window.sessionStorage.getItem(PENDING_SCROLL_KEY);
    if (!target) {
      return;
    }

    window.sessionStorage.removeItem(PENDING_SCROLL_KEY);
    requestAnimationFrame(() => {
      const section = document.getElementById(target);
      section?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div id="about">
          <About />
        </div>
        <div id="services">
          <Services />
        </div>
        <div id="appointment-booking">
          <AppointmentBooking />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
