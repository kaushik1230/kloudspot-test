import React, { useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import StatCard from "./components/StatCard";
import OccupancyChart from "./components/OccupancyChart";
import DemographicsSection from "./components/DemographicsSection";
import CrowdEntries from "./components/CrowdEntries";
import { useDashboardAnalytics } from "./hooks/useDashboardAnalytics";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  
  const { 
    sites, 
    selectedSite, 
    setSelectedSite, 
    stats, 
    alerts, 
    occupancyData, 
    demographicsTrend, 
    demographicsPie 
  } = useDashboardAnalytics();

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sites={sites}
      selectedSite={selectedSite}
      setSelectedSite={setSelectedSite}
      alerts={alerts}
    >
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
    </DashboardLayout>
  );
};

export default Dashboard;