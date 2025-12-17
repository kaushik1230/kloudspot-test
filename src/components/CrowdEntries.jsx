import React, { useState, useEffect } from 'react';
import EntriesTable from './EntriesTable';
import Pagination from './Pagination';

const CrowdEntries = ({ siteId }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formatTime = (dateInput) => {
    if (!dateInput) return '--';
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? '--' : date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  useEffect(() => {
    if (!siteId) return; 

    const fetchEntries = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const start = new Date();
      start.setHours(0,0,0,0);
      const end = new Date();
      end.setHours(23,59,59,999);

      try {
        const response = await fetch('https://hiring-dev.internal.kloudspot.com/api/analytics/entry-exit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ 
                siteId: siteId,
                fromUtc: start.getTime(),
                toUtc: end.getTime(),
                pageSize: 10,
                pageNumber: page 
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            
            const records = data.records || [];
      
            let entryTime = data.fromUtc;
            let exitTime = data.toUtc;
            let dwellTime = exitTime-entryTime;
            let totalMinutes = Math.floor(dwellTime / (1000 * 60));
            let hours = Math.floor(totalMinutes / 60);
            let minutes = totalMinutes % 60;
            
            const mappedResults = records.map(r => ({
                visitorName: r.personName || 'Unknown',
                gender: r.gender || 'Unknown',
                entryTime: formatTime(entryTime),
                exitTime: formatTime(exitTime),
                dwellTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
            }));
            
            setEntries(mappedResults);
            
            const totalRecs = data.totalRecords || 0;
            setTotalPages(totalRecs > 0 ? Math.ceil(totalRecs / 10) : 1);
        }
      } catch (err) {
        console.error("Error fetching entries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [page, siteId]);

  return (
    <div className="animate-fade-in">

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        Crowd Entries
      </h2>
      
      <EntriesTable entries={entries} loading={loading} />
      
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      
    </div>
  );
};

export default CrowdEntries;