import React from 'react';
import { FiX } from 'react-icons/fi';
import AlertCard from './AlertCard';

const NotificationSidebar = ({ isOpen, onClose, alerts }) => {
  return (
    <>
    
      {isOpen && (
        <div 
         
          className="fixed inset-0 bg-opacity-50 z-50" 
          onClick={onClose}
        />
      )}

     
      <div className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Alerts</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {alerts.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No new alerts</p>
          ) : (
            alerts.map((alert, idx) => <AlertCard key={idx} alert={alert} />)
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;