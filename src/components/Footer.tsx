import React from 'react';
import { Mail, Settings } from 'lucide-react';

interface FooterProps {
  onCookieSettings?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onCookieSettings }) => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white lg:relative lg:bottom-0">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <p className="text-gray-400 text-sm">© 2025 France Pharmacies</p>
          <div className="flex items-center gap-4">
            <a 
              href="mailto:contact@francepharmacies.org" 
              className="text-gray-400 hover:text-white text-sm lg:text-sm flex items-center transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              contact@francepharmacies.org
            </a>
            {onCookieSettings && (
              <button
                onClick={onCookieSettings}
                className="text-gray-400 hover:text-white text-sm lg:text-sm flex items-center transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Cookies
              </button>
            )}
          </div>
        </div>
        
        {/* Liens légaux */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-300 transition-colors">Politique de confidentialité</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-300 transition-colors">Conditions d'utilisation</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-300 transition-colors">Mentions légales</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-300 transition-colors">RGPD</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;