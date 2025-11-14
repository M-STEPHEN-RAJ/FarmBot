"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react";
import Loading from '../common/Loading';

const Navbar = () => {

  const router = useRouter();

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRegisterRedirect = () => {
    setLoading(true);
    router.push('/register');
  }

  const handleLoginRedirect = () => {
    setLoading(true);
    router.push("/login");
  };

  return (
    <>
    {loading && <Loading />}
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center items-center transition-all duration-500 ${ showNavbar ? "translate-y-0" : "-translate-y-20" }`}>
        <div className='flex justify-between items-center max-w-[1200px] w-full px-2 py-0.5 bg-white/50 backdrop-blur-md border border-gray-300 rounded-full'>

            <div className="flex items-center cursor-pointer">
                <img src="/images/landing/logo.png" alt="" className='w-15' />
                <h2 className='text-xl font-semibold'>FarmBot</h2>
            </div>

            <div className="flex gap-10">
                <p className='cursor-pointer' onClick={() => scrollToSection("home")}>Home</p>
                <p className='cursor-pointer' onClick={() => scrollToSection("about-us")}>About Us</p>
                <p className='cursor-pointer' onClick={() => scrollToSection("faq")}>Faq</p>
                <p className='cursor-pointer' onClick={() => scrollToSection("footer")}>Contact Us</p>
            </div>

            <div className="space-x-2">
                <button onClick={handleRegisterRedirect} className='w-25 hover:bg-[#1B8841]/10 transition-all duration-300 rounded-full py-1 cursor-pointer'>
                    Register
                </button>
                <button onClick={handleLoginRedirect} className='w-25 bg-[#1B8841] hover:bg-[#1B8841]/90 transition-all duration-300 text-white rounded-full py-1 cursor-pointer'>
                    Login
                </button>
            </div>


        </div>
    </div>
    </>
  )
}

export default Navbar