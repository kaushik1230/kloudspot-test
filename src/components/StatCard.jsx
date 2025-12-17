import React from 'react';
import { FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';

const StatCard = ({ title, value, trend, subText, isPositive }) => {
  // Determine color and icon based on trend
  const isNeutral = trend === '--' || trend === '0%';
  const trendColor = isNeutral 
    ? 'text-gray-400' 
    : isPositive 
      ? 'text-teal-600' 
      : 'text-red-500';

  const TrendIcon = isNeutral 
    ? FiMinus 
    : isPositive 
      ? FiArrowUp 
      : FiArrowDown;

  return (
  
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div>
       
        <h3 className="text-gray-500 text-xs md:text-sm font-medium mb-1">{title}</h3>
    
        <div className="text-xl md:text-2xl font-bold text-gray-800">{value}</div>
      </div>
   
      <div className="flex items-center mt-2 md:mt-4">
       
        <span className={`flex items-center text-xs md:text-sm font-semibold ${trendColor} bg-opacity-10 rounded-full`}>
          <TrendIcon className="mr-1" />
          {trend}
        </span>
       
        <span className="text-gray-400 text-[10px] md:text-xs ml-2 truncate">{subText}</span>
      </div>
    </div>
  );
};

export default StatCard;