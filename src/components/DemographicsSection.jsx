import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DemographicsSection = ({ pieData, trendData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      
     
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-sm md:text-base">Chart of Demographics</h3>
        
        <div className="w-full relative h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
         
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-sm text-gray-400">Total Crowd</span>
             <span className="text-xl font-bold text-gray-800">100%</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
            {pieData.map((d) => (
                <div key={d.name} className="flex items-center text-sm text-gray-600">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                    <span className="font-medium mr-1">{d.value}%</span> {d.name}s
                </div>
            ))}
        </div>
      </div>

     
      <div className="md:col-span-2 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-sm md:text-base">Demographics Analysis</h3>
        
       
        <div className="w-full h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              <Line type="monotone" dataKey="male" name="Male" stroke="#14b8a6" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="female" name="Female" stroke="#99f6e4" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DemographicsSection;