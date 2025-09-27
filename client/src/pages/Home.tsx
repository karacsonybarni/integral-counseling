import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import AppointmentBooking from "@/components/AppointmentBooking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <div id="services">
          <Services />
        </div>
        <div id="appointment-booking">
          <AppointmentBooking />
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}