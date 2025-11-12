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
      <div id="home">
        <Home />
      </div>
      <div id="about-us">
        <AboutUs />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="faq">
        <Faq />
      </div>
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}
