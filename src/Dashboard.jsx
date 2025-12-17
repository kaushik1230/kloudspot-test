import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FiMenu } from "react-icons/fi"; 

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import NotificationSidebar from "./components/NotificationSidebar";
import StatCard from "./components/StatCard";
import OccupancyChart from "./components/OccupancyChart";
import DemographicsSection from "./components/DemographicsSection";
import CrowdEntries from "./components/CrowdEntries";

const API_BASE = "/api";
const SOCKET_URL = "https://hiring-dev.internal.kloudspot.com";

const Dashboard = () => {
  const navigate = useNavigate();

 
  const [activeTab, setActiveTab] = useState("overview");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [alerts, setAlerts] = useState([]);

  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

 
  const [stats, setStats] = useState({
    occupancy: 0, occupancyTrend: "--", occupancyPos: true,
    footfall: 0, footfallTrend: "--", footfallPos: true,
    dwellTime: "0 min", dwellTrend: "--", dwellPos: true,
  });

  const [occupancyData, setOccupancyData] = useState([]);
  const [demographicsTrend, setDemographicsTrend] = useState([]);
  const [demographicsPie, setDemographicsPie] = useState([
    { name: "Male", value: 0, color: "#14b8a6" },
    { name: "Female", value: 0, color: "#99f6e4" },
  ]);

  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !isMobile) setIsCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

 
  const getLast24HoursUtc = () => {
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    return { fromUtc: Math.floor(start.getTime()), toUtc: Math.floor(end.getTime()) };
  };

  const getPrev24HoursUtc = () => {
    const end = new Date();
    const startOfPrev = new Date(end.getTime() - 48 * 60 * 60 * 1000);
    const endOfPrev = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    return { fromUtc: Math.floor(startOfPrev.getTime()), toUtc: Math.floor(endOfPrev.getTime()) };
  };

  const getYesterdaySameTimeUtc = () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const start = new Date(yesterday.getTime() - 10 * 60 * 1000);
    const end = new Date(yesterday.getTime() + 10 * 60 * 1000);
    return { fromUtc: Math.floor(start.getTime()), toUtc: Math.floor(end.getTime()) };
  };

  function transformName(str) {
    const words = (str || "").trim().split(/\s+/);
    if (words.length <= 2) return str;
    return words.slice(0, 2).join(" ");
  }

  function removeLastTwoWords(str) {
    const words = (str || "").trim().split(/\s+/);
    if (words.length <= 2) return str;
    return words.slice(0, -2).join(" ");
  }

  
  const calculateTrend = (current, previous) => {
   
    if (previous === undefined || previous === null || isNaN(previous)) {
        return { label: "--", isPositive: true };
    }

   
    if (previous === 0) {
      if (current === 0) return { label: "0%", isPositive: true };
      return { label: "+100%", isPositive: true };
    }

   
    const diff = current - previous;
    const percentage = (diff / previous) * 100;
    const rounded = Math.round(percentage); // STRICT INTEGER

    const label = `${rounded > 0 ? "+" : ""}${rounded}%`;

    return { label, isPositive: rounded >= 0 };
  };

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    const socket = io(SOCKET_URL, { transports: ["websocket"], auth: { token } });

    socket.on("live_occupancy", (data) => {
      const val = typeof data === "object" ? data.siteOccupancy || data.count || 0 : data;
      setStats((prev) => ({ ...prev, occupancy: val }));
    });

    socket.on("alert", (data) => {
      let namePerson = transformName(data.personName || "Unknown");
      let zoneName = removeLastTwoWords(data.zoneName || "Zone");
      setAlerts((prev) => [
        {
          title: `${namePerson} ${data.direction || ""}`,
          zone: zoneName,
          severity: data.severity || "info",
          timestamp: data.ts || new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    const fetchSites = async () => {
      try {
        const res = await fetch(`${API_BASE}/sites`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setSites(data);
          if (data.length > 0) setSelectedSite(data[0]);
        }
      } catch (e) { console.error("Error fetching sites:", e); }
    };

    fetchSites();
    return () => socket.disconnect();
  }, [navigate]);

 
  useEffect(() => {
    if (!selectedSite) return;

    let active = true; 

   
    setStats(prev => ({
        ...prev,
        occupancyTrend: "--", 
        footfallTrend: "--", 
        dwellTrend: "--"
    }));
    setOccupancyData([]); 
    setDemographicsTrend([]);

    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

      const post = async (ep, range) => {
        try {
          const res = await fetch(`${API_BASE}/analytics/${ep}`, {
            method: "POST",
            headers,
            body: JSON.stringify({ siteId: selectedSite.siteId, ...range }),
          });
          if (!res.ok) return null; 
          return await res.json();
        } catch (e) { return null; }
      };

      const currRange = getLast24HoursUtc();
      const prevRange = getPrev24HoursUtc();
      const snapshotRange = getYesterdaySameTimeUtc();

     
      const currentPromise = Promise.all([
        post("dwell", currRange),
        post("footfall", currRange),
        post("occupancy", currRange),
        post("demographics", currRange),
      ]);

     
      const historyPromise = Promise.all([
        post("occupancy", snapshotRange),
        post("dwell", prevRange),
        post("footfall", prevRange),
      ]);

      
      const [dwellCurr, footfallCurr, occCurr, demoCurr] = await currentPromise;

      if (!active) return; 

      const lastOccBucket = (occCurr?.buckets && occCurr.buckets.length > 0) 
        ? occCurr.buckets[occCurr.buckets.length - 1] 
        : null;
      
      const lastOccValue = lastOccBucket ? (lastOccBucket.avg || lastOccBucket.count || 0) : 0;
      const currentDwell = dwellCurr?.avgDwellMinutes || 0;
      const currentFootfall = footfallCurr?.footfall || 0;
      
      const liveOccupancy = stats.occupancy > 0 ? stats.occupancy : Math.round(lastOccValue);

      setStats((prev) => ({
        ...prev,
        dwellTime: currentDwell ? `${Math.round(currentDwell)} min` : "0 min",
        footfall: currentFootfall,
        occupancy: liveOccupancy,
      }));

    
      const rawOcc = Array.isArray(occCurr) ? occCurr : occCurr?.buckets || [];
      setOccupancyData(
        rawOcc.map((b) => ({
          time: new Date(b.timestamp || b.utc || b.fromUtc).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          count: b.avg || b.count || b.occupancy || 0,
        }))
      );

      const rawDemo = Array.isArray(demoCurr) ? demoCurr : demoCurr?.buckets || [];
      setDemographicsTrend(
        rawDemo.map((b) => ({
          time: new Date(b.timestamp || b.utc || b.fromUtc).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          male: b.male || 0,
          female: b.female || 0,
        }))
      );

      let totalMale = 0, totalFemale = 0;
      rawDemo.forEach((b) => { totalMale += b.male || 0; totalFemale += b.female || 0; });
      if (totalMale + totalFemale > 0) {
        const malePct = Math.round((totalMale / (totalMale + totalFemale)) * 100);
        setDemographicsPie([
          { name: "Male", value: malePct, color: "#14b8a6" },
          { name: "Female", value: 100 - malePct, color: "#99f6e4" },
        ]);
      }

     
      const [occYesterdaySnapshot, dwellPrev, footfallPrev] = await historyPromise;

      if (!active) return; 

      
      console.log(` ${selectedSite.name}`);
      console.log("Footfall (Today vs Yesterday):", currentFootfall, "vs", footfallPrev?.footfall);
      console.log("Dwell (Today vs Yesterday):", currentDwell, "vs", dwellPrev?.avgDwellMinutes);

      const getAvgFromSnapshot = (data) => {
        const buckets = Array.isArray(data) ? data : data?.buckets || [];
        if (buckets.length === 0) return 0;
        return buckets.reduce((acc, b) => acc + (b.avg || b.count || 0), 0) / buckets.length;
      };

     
      const prevDwellVal = dwellPrev?.avgDwellMinutes; 
      const prevFootfallVal = footfallPrev?.footfall;
      const prevOccupancyVal = getAvgFromSnapshot(occYesterdaySnapshot);

      const occTrend = calculateTrend(liveOccupancy, prevOccupancyVal);
      const dwellTrend = calculateTrend(currentDwell, prevDwellVal);
      const footfallTrend = calculateTrend(currentFootfall, prevFootfallVal);

      setStats((prev) => ({
        ...prev,
        dwellTrend: dwellTrend.label, dwellPos: dwellTrend.isPositive,
        footfallTrend: footfallTrend.label, footfallPos: footfallTrend.isPositive,
        occupancyTrend: occTrend.label, occupancyPos: occTrend.isPositive,
      }));
    };

    fetchAnalytics();

    return () => { active = false; };
  }, [selectedSite, activeTab]); 

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/login");
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
        ${isMobile 
          ? 'ml-0 w-full' 
          : (isCollapsed ? 'ml-20' : 'ml-64') 
        }
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
          sites={sites} selectedSite={selectedSite} onSiteChange={setSelectedSite} 
        />

        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          {activeTab === "overview" ? (
            <div className="animate-fade-in space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className="text-xl font-bold text-gray-800">Overview</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <StatCard 
                  title="Live Occupancy" 
                  value={Math.round(stats.occupancy)} 
                  trend={stats.occupancyTrend} 
                  subText={stats.occupancyTrend ? "vs yesterday" : "Calculating..."} 
                  isPositive={stats.occupancyPos} 
                />
                <StatCard 
                  title="Today's Footfall" 
                  value={stats.footfall.toLocaleString()} 
                  trend={stats.footfallTrend} 
                  subText={stats.footfallTrend ? "vs prev 24h" : "Calculating..."} 
                  isPositive={stats.footfallPos} 
                />
                <StatCard 
                  title="Avg Dwell Time" 
                  value={stats.dwellTime} 
                  trend={stats.dwellTrend} 
                  subText={stats.dwellTrend ? "vs prev 24h" : "Calculating..."} 
                  isPositive={stats.dwellPos} 
                />
              </div>

              <OccupancyChart data={occupancyData} />
              <DemographicsSection pieData={demographicsPie} trendData={demographicsTrend} />
            </div>
          ) : (
            <CrowdEntries siteId={selectedSite?.siteId} />
          )}
        </main>
      </div>

      <NotificationSidebar isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} alerts={alerts} />

    </div>
  );
};

export default Dashboard;