import React, { useState } from 'react';
import { FiBell, FiUser, FiMapPin, FiChevronDown } from 'react-icons/fi';

const Header = ({ onToggleNotifications, notificationCount, sites, selectedSite, onSiteChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    
    <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-4 md:px-8 shadow-sm">
      
     
      <div className="flex items-center space-x-2 md:space-x-4">
        <h1 className="text-lg font-bold text-gray-800 hidden md:block">Crowd Solutions</h1>
        <span className="text-gray-300 text-xl font-light hidden md:block">|</span>
        
       
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          
            className="flex items-center space-x-2 text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 md:px-3 py-1.5 rounded-md border border-gray-200 transition-colors"
          >
            <FiMapPin size={14} className="text-teal-600 flex-shrink-0" />
            
            
            <span className="text-sm font-medium max-w-[100px] sm:max-w-[200px] md:max-w-none truncate">
              {selectedSite ? selectedSite.name : 'Loading...'}
            </span>
            
            <FiChevronDown size={14} className={`transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          
          {isDropdownOpen && sites.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1">
              {sites.map((site) => (
                <button
                  key={site.siteId}
                  onClick={() => {
                    onSiteChange(site);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${selectedSite?.siteId === site.siteId ? 'text-teal-600 font-medium bg-teal-50' : 'text-gray-700'}`}
                >
                  <span className="truncate">{site.name}</span>
                  {selectedSite?.siteId === site.siteId && <span className="w-2 h-2 rounded-full bg-teal-600 flex-shrink-0 ml-2"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      
      <div className="flex items-center space-x-3 md:space-x-6">
        
        <div className="relative cursor-pointer" onClick={onToggleNotifications}>
          <FiBell className="text-gray-600 text-xl hover:text-teal-600 transition-colors" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-3 h-3 flex items-center justify-center rounded-full">
             
            </span>
          )}
        </div>

        <div className="w-8 h-8 md:w-9 md:h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 border border-gray-300">
          <FiUser size={18} />
        </div>
      </div>
    </header>
  );
};

export default Header;