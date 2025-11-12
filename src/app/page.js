import Navbar from './components/landing/Navbar';
import Home from './components/landing/Home';
import Testimonials from './components/landing/Testimonials';
import Faq from './components/landing/Faq';
import Footer from './components/landing/Footer'
import AboutUs from './components/landing/AboutUs';

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <Home />
      <AboutUs />
      <Testimonials />
      <Faq />
      <Footer />
    </div>
  );
}
