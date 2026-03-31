
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f8f8f8] border-t border-gray-200 mt-16 pb-0 pb-[40px] lg:pb-0">

      <div className="max-w-[1200px] mx-auto px-6 py-12">

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 space-y-4">

            <div className="flex items-center gap-2">

              <img
                src={logo}
                alt="Just Eat Bharat"
                className="w-[46px] h-[46px] rounded-full object-contain"
              />

              <h3
                className="text-[15px] font-semibold text-gray-900"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Just Eat Bharat
              </h3>

            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Your favorite food delivered fast to your doorstep.
              Fresh meals from trusted restaurants across India.
            </p>

            <div className="flex gap-3">

              <a className="p-2 rounded-full border border-gray-200 hover:bg-[#F97415] hover:text-white transition">
                <Facebook size={16} />
              </a>

              <a className="p-2 rounded-full border border-gray-200 hover:bg-[#F97415] hover:text-white transition">
                <Instagram size={16} />
              </a>

              <a className="p-2 rounded-full border border-gray-200 hover:bg-[#F97415] hover:text-white transition">
                <Twitter size={16} />
              </a>

            </div>

          </div>

          {/* Quick Links */}
          <div>

            <h4 className="font-semibold text-[14px] text-gray-900 mb-4">
              Quick Links
            </h4>

            <ul className="space-y-2">

              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-[#F97415] transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-[#F97415] transition">
                  About Us
                </Link>
              </li>

              <li>
                <Link to="/jobs-career" className="text-sm text-gray-600 hover:text-[#F97415] transition">
                  Careers
                </Link>
              </li>

              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-[#F97415] transition">
                  Contact Us
                </Link>
              </li>

            </ul>

          </div>

          {/* Support */}
          <div>

            <h4 className="font-semibold text-[14px] text-gray-900 mb-4">
              Support
            </h4>

            <ul className="space-y-2">

              <li>
                <a className="text-sm text-gray-600 hover:text-[#F97415] transition">
                  Help Center
                </a>
              </li>

              <li>
                <a className="text-sm text-gray-600 hover:text-[#F97415] transition">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a className="text-sm text-gray-600 hover:text-[#F97415] transition">
                  Terms & Conditions
                </a>
              </li>

              <li>
                <a className="text-sm text-gray-600 hover:text-[#F97415] transition">
                  Refund Policy
                </a>
              </li>

            </ul>

          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">

            <h4 className="font-semibold text-[14px] text-gray-900 mb-4">
              Get in Touch
            </h4>

            <ul className="space-y-3">

              <li className="flex items-start gap-2">
                <Phone size={16} className="text-[#F97415] mt-1" />
                <a href="tel:+917404133302" className="text-sm text-gray-600 hover:text-[#F97415]">
                  +91 7404133302
                </a>
              </li>

              <li className="flex items-start gap-2">
                <Phone size={16} className="text-[#F97415] mt-1" />
                <a href="tel:+917404233302" className="text-sm text-gray-600 hover:text-[#F97415]">
                  +91 7404233302
                </a>
              </li>

              <li className="flex items-start gap-2">
                <Mail size={16} className="text-[#F97415] mt-1" />
                <a href="mailto:support@justeatbharat.com" className="text-sm text-gray-600 hover:text-[#F97415]">
                  support@justeatbharat.com
                </a>
              </li>

              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-[#F97415] mt-1" />
                <span className="text-sm text-gray-600">
                  Zirakpur, Punjab - 140603
                </span>
              </li>

            </ul>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-10 pt-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-gray-500">

            <p>© {currentYear} JustEat Bharat. All rights reserved.</p>

            <div className="flex gap-6">
              <a className="hover:text-[#F97415] transition">Privacy Policy</a>
              <a className="hover:text-[#F97415] transition">Terms of Service</a>
              <a className="hover:text-[#F97415] transition">Cookies</a>
            </div>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;
