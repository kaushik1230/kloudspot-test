import React from 'react'; 
import { FiHome, FiMaximize, FiPower, FiMenu } from 'react-icons/fi';
import Kloudspot from '../assets/Kloudspot';
import side_bar_background from "../assets/side_bar_background.png";

const Sidebar = ({ activeTab, setActiveTab, onLogout, isCollapsed, toggleSidebar }) => {
  
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'entries', label: 'Crowd Entries', icon: FiMaximize },
  ];

  return (
    <aside 
      className={`h-full w-full bg-[#1a3e44] text-white flex flex-col shadow-xl bg-cover bg-center bg-no-repeat overflow-hidden`} 
      style={{ backgroundImage: `url(${side_bar_background})` }}
    >
      
     
      <div className={`h-16 flex items-center flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
        
      
        <div className={`transition-all duration-300 overflow-hidden flex items-center ${isCollapsed ? 'w-0 opacity-0' : 'w-32 opacity-100'}`}>
           <Kloudspot />
        </div>

       
        <button 
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none"
        >
          <FiMenu size={24} />
        </button>

      </div>

      
      <nav className="flex-1 mt-6 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : ''} 
              className={`w-full flex items-center py-4 transition-all border-l-4 group relative
                ${isCollapsed ? 'justify-center px-0' : 'px-6 space-x-3'} 
                ${isActive
                  ? 'bg-[#5c6f73] bg-opacity-40 border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-[#5c6f73] hover:bg-opacity-20'
              }`}
            >
              <Icon size={20} className="min-w-[20px] flex-shrink-0" />
              
             
              <span className={`font-medium whitespace-nowrap transition-all duration-300 origin-left ${
                isCollapsed ? 'w-0 opacity-0 scale-0' : 'w-auto opacity-100 scale-100'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10 flex-shrink-0">
        <button
          onClick={onLogout}
          title={isCollapsed ? 'Logout' : ''}
          className={`flex items-center transition-colors w-full text-gray-400 hover:text-white
            ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}`}
        >
          <FiPower size={20} className="min-w-[20px] flex-shrink-0" />
          <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;