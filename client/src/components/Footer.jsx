import { useState } from 'react';
import { ChevronUp, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const currentYear = new Date().getFullYear();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-100">
      {/* Top button */}
      <div className="flex justify-center">
        <button 
          onClick={scrollToTop}
          className="bg-white shadow-md rounded-full p-3 -mt-5 hover:shadow-lg transition-all duration-300 focus:outline-none"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand section */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="font-bold text-2xl text-gray-800">Ecommerce</h2>
            <p className="text-sm leading-relaxed">
              Curated designs for the modern lifestyle. We believe in simplicity, quality craftsmanship, and sustainable practices.
            </p>
            
            {/* Social icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors" aria-label="Email us">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2">
            <h3 className="font-medium text-sm text-gray-800 uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-2 text-sm">
              {['All Products', 'New Arrivals', 'Bestsellers', 'Sale'].map((item, i) => (
                <li key={i}>
                  <a 
                    href="#" 
                    className="hover:text-gray-800 transition-colors" 
                    onMouseEnter={() => setActiveSection(`shop-${i}`)}
                    onMouseLeave={() => setActiveSection(null)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium text-sm text-gray-800 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {['About Us', 'Our Story', 'Sustainability', 'Careers'].map((item, i) => (
                <li key={i}>
                  <a 
                    href="#" 
                    className="hover:text-gray-800 transition-colors" 
                    onMouseEnter={() => setActiveSection(`company-${i}`)}
                    onMouseLeave={() => setActiveSection(null)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-medium text-sm text-gray-800 uppercase tracking-wider mb-4">
              Stay Connected
            </h3>
            <p className="text-sm mb-4">
              Subscribe for exclusive offers and early access to new collections.
            </p>
            
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded px-3 py-1 text-sm transition-colors"
              >
                Join
              </button>
            </form>
            
            {isSubmitted && (
              <p className="text-green-600 mt-2 text-xs">
                Thank you! You're now subscribed.
              </p>
            )}
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>
            © {currentYear} <span className="font-medium">Ecommerce</span>. All rights reserved.
          </p>
          
          <div className="flex flex-wrap gap-5 mt-4 md:mt-0">
            {['Terms', 'Privacy', 'Cookies', 'FAQ'].map((item, i) => (
              <a 
                key={i}
                href="#" 
                className="hover:text-gray-800 transition-colors"
                onMouseEnter={() => setActiveSection(`legal-${i}`)}
                onMouseLeave={() => setActiveSection(null)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}