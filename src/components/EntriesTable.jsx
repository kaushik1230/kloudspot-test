import React from 'react';

const EntriesTable = ({ entries, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
     
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Visitor Name', 'Sex', 'Entry Time', 'Exit Time', 'Dwell Time'].map(head => (
               
                <th key={head} className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="px-4 md:px-6 py-10 text-center text-gray-500">Loading records...</td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan="5" className="px-4 md:px-6 py-10 text-center text-gray-500">No records found.</td></tr>
            ) : (
              entries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 mr-3 flex-shrink-0 flex items-center justify-center text-xs text-gray-500 font-bold">
                      {entry.visitorName?.charAt(0) || 'V'}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{entry.visitorName}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.gender}</td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.entryTime}</td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.exitTime || '--'}</td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.dwellTime || '--'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntriesTable;