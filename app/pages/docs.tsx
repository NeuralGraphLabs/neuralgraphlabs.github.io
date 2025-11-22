import React from 'react';
import ReactDOM from 'react-dom/client';
import NavbarSecondary from '../components/NavbarSecondary';
import { FadeIn } from '../components/ui/Library';
import { LOGO_PATH } from '../constants';

const rootElement = document.getElementById('app')!;
if (!rootElement) {
  throw new Error("Could not find doc root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased">
      <NavbarSecondary />
      
      <main className="flex-grow">
        abc
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <FadeIn>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 <img 
                  src= {LOGO_PATH}
                  w = '70'
                  alt= "ADL Logo"
                  loading="lazy"
                  decoding="async"
                  className="w-[70px] h-[70px] object-cover opacity-90"
                />
              </div>
            </FadeIn>
            
            <FadeIn delay={100}>
              <div className="flex gap-8 text-sm text-gray-400">
                <a href="#" className="hover:text-sunflower-500 transition-colors">GitHub</a>
                <a href="#" className="hover:text-sunflower-500 transition-colors">Twitter</a>
                <a href="#" className="hover:text-sunflower-500 transition-colors">Discord</a>
                <a href="#" className="hover:text-sunflower-500 transition-colors">Privacy</a>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="text-xs text-gray-300">
                © {new Date().getFullYear()} AutodiffLabs. All rights reserved.
              </p>
            </FadeIn>
          </div>
        </footer>
      </main>
    </div>
  </React.StrictMode>
);