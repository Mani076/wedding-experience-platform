import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-bold text-2xl text-rose-500">WedIndia</span>
            <p className="mt-4 text-gray-400 text-sm">
              Experience the magic, colors, and traditions of an authentic Indian wedding. 
              Join families as an honored guest.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li><a href="/weddings" className="hover:text-rose-400">Browse Weddings</a></li>
              <li><a href="/about" className="hover:text-rose-400">How it Works</a></li>
              <li><a href="/faq" className="hover:text-rose-400">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>support@wedindia.com</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 flex items-center justify-center text-sm text-gray-400">
          <p className="flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-rose-500" /> in India &copy; {new Date().getFullYear()} WedIndia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
