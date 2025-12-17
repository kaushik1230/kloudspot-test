import React from 'react';
import { FiMapPin } from 'react-icons/fi';

const AlertCard = ({ alert }) => {
  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-orange-400';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  function formatTimestamp(ts) {
    if (!ts) return '--';
    const date = new Date(ts); 
    const monthName = date.toLocaleString('en-US', { month: 'long' }); 
    const day = String(date.getDate()).padStart(2, '0');  
    const year = date.getFullYear();                      
    return `${monthName} ${day} ${year}`;                
  }

  function formatTime(ts) {
    if (!ts) return '--:--';
    const date = new Date(ts * (ts < 10000000000 ? 1000 : 1));
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`; 
  }

  let monthYear = formatTimestamp(alert.timestamp);
  let timeHour = formatTime(alert.timestamp);

  return (
    <div className="border border-gray-200 rounded-lg p-3 md:p-4 shadow-sm relative hover:shadow-md transition-shadow bg-white w-full">

      <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span className="whitespace-nowrap">{monthYear}</span>
          <span className="whitespace-nowrap">{timeHour}</span>
      </div>

     
      <h3 className="font-bold text-gray-800 mb-2 text-sm md:text-base truncate" title={alert.title}>
        {alert.title}
      </h3>

      <div className="flex justify-between items-end mt-2">
        <div className="flex items-center text-xs text-gray-500 min-w-0 mr-2">
          <FiMapPin className="mr-1 flex-shrink-0" />
          <span className="truncate" title={alert.zone}>{alert.zone}</span>
        </div>

        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded text-white flex-shrink-0 ${getSeverityStyle(alert.severity)}`}>
          {alert.severity || 'INFO'}
        </span>
      </div>

    </div>
  );
};

export default AlertCard;