import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi"; 
import Sidebar from "./Sidebar";
import Header from "./Header";
import NotificationSidebar from "./NotificationSidebar";

const DashboardLayout = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  sites, 
  selectedSite, 
  setSelectedSite, 
  alerts 
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !isMobile) setIsCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans relative overflow-x-hidden">
      
      
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setIsCollapsed(true)} 
        />
      )}

      
      <div className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 transform 
        ${isMobile 
          ? (isCollapsed ? '-translate-x-full' : 'translate-x-0 w-64') 
          : (isCollapsed ? 'w-20' : 'w-64')
        }
      `}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab); if(isMobile) setIsCollapsed(true); }} 
          onLogout={handleLogout}
          isCollapsed={isMobile ? false : isCollapsed} 
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

     
      <div className={`flex-1 transition-all duration-300 min-h-screen flex flex-col
        ${isMobile ? 'ml-0 w-full' : (isCollapsed ? 'ml-20' : 'ml-64')}
      `}>
        
       
        {isMobile && (
          <div className="bg-white p-4 border-b flex items-center justify-between sticky top-0 z-30 shadow-sm">
             <button onClick={() => setIsCollapsed(false)} className="text-gray-600 focus:outline-none p-2 rounded hover:bg-gray-100">
                <FiMenu size={24} />
             </button>
             <span className="font-bold text-lg text-gray-800">Kloudspot</span>
             <div className="w-8"></div>
          </div>
        )}

        <Header 
          onToggleNotifications={() => setIsNotifOpen(true)} 
          notificationCount={alerts.length} 
          sites={sites} 
          selectedSite={selectedSite} 
          onSiteChange={setSelectedSite} 
        />

        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

      <NotificationSidebar isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} alerts={alerts} />
    </div>
  );
};

export default DashboardLayout;