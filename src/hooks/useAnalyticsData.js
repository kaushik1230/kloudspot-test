import { useState, useEffect } from "react";


const getUtcRange = (hoursBackStart, hoursBackEnd) => {
  const end = new Date();
  const start = new Date(end.getTime() - hoursBackStart * 60 * 60 * 1000);
  const endDt = new Date(end.getTime() - hoursBackEnd * 60 * 60 * 1000);
  return { fromUtc: Math.floor(start.getTime()), toUtc: Math.floor(endDt.getTime()) };
};

const calculateTrend = (current, previous) => {
  if (previous === undefined || previous === null || isNaN(previous)) return { label: "--", isPositive: true };
  if (previous === 0) return current === 0 ? { label: "0%", isPositive: true } : { label: "+100%", isPositive: true };
  
  const diff = current - previous;
  const percentage = (diff / previous) * 100;
  const rounded = Math.round(percentage);
  const label = `${rounded > 0 ? "+" : ""}${rounded}%`;
  return { label, isPositive: rounded >= 0 };
};


export const useAnalyticsData = (apiBase, selectedSite) => {
  const [stats, setStats] = useState({
    // Store raw values here, not just formatted strings
    footfall: 0, footfallTrend: "--", footfallPos: true,
    dwellTime: "0 min", dwellTrend: "--", dwellPos: true,
    historicalOccupancy: 0, // Store yesterday's occupancy here
  });
  
  const [occupancyData, setOccupancyData] = useState([]);
  const [demographicsTrend, setDemographicsTrend] = useState([]);
  const [demographicsPie, setDemographicsPie] = useState([
    { name: "Male", value: 0, color: "#14b8a6" },
    { name: "Female", value: 0, color: "#99f6e4" },
  ]);

  useEffect(() => {
    if (!selectedSite) return;
    let active = true;

    
    setOccupancyData([]); 
    setDemographicsTrend([]);

    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");
      const post = async (ep, range) => {
        try {
          const res = await fetch(`${apiBase}/analytics/${ep}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ siteId: selectedSite.siteId, ...range }),
          });
          return res.ok ? await res.json() : null;
        } catch { return null; }
      };

      const currRange = getUtcRange(24, 0); 
      const prevRange = getUtcRange(48, 24); 
      const snapshotRange = getUtcRange(24.1, 23.9); 

      
      const [dwellCurr, footfallCurr, occCurr, demoCurr] = await Promise.all([
        post("dwell", currRange),
        post("footfall", currRange),
        post("occupancy", currRange),
        post("demographics", currRange),
      ]);

      if (!active) return;

      const currentDwell = dwellCurr?.avgDwellMinutes || 0;
      const currentFootfall = footfallCurr?.footfall || 0;
      
     
      const occBuckets = occCurr?.buckets || [];
      setOccupancyData(occBuckets.map(b => ({
          time: new Date(b.timestamp || b.utc || b.fromUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          count: b.avg || b.count || 0
      })));

      const demoBuckets = demoCurr?.buckets || [];
      setDemographicsTrend(demoBuckets.map(b => ({
          time: new Date(b.timestamp || b.utc || b.fromUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          male: b.male || 0,
          female: b.female || 0
      })));

      let tMale = 0, tFemale = 0;
      demoBuckets.forEach(b => { tMale += b.male || 0; tFemale += b.female || 0; });
      if (tMale + tFemale > 0) {
        const mPct = Math.round((tMale / (tMale + tFemale)) * 100);
        setDemographicsPie([{ name: "Male", value: mPct, color: "#14b8a6" }, { name: "Female", value: 100 - mPct, color: "#99f6e4" }]);
      }

      
      const [occSnap, dwellPrev, footfallPrev] = await Promise.all([
        post("occupancy", snapshotRange),
        post("dwell", prevRange),
        post("footfall", prevRange),
      ]);

      if (!active) return;

      const getAvg = (d) => (d?.buckets || []).reduce((acc, b) => acc + (b.avg || b.count || 0), 0) / (d?.buckets?.length || 1);
      const histOcc = getAvg(occSnap); // Yesterday's average occupancy

      const dwellTrend = calculateTrend(currentDwell, dwellPrev?.avgDwellMinutes);
      const footfallTrend = calculateTrend(currentFootfall, footfallPrev?.footfall);

      setStats({
        dwellTime: currentDwell ? `${Math.round(currentDwell)} min` : "0 min",
        footfall: currentFootfall,
        dwellTrend: dwellTrend.label, dwellPos: dwellTrend.isPositive,
        footfallTrend: footfallTrend.label, footfallPos: footfallTrend.isPositive,
        historicalOccupancy: histOcc // Passing this up so Composer can compare with Live
      });
    };

    fetchAnalytics();
    return () => { active = false; };
  }, [selectedSite, apiBase]); 

  return { stats, occupancyData, demographicsTrend, demographicsPie };
};