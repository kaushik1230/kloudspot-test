import { useSites } from "./useSites";
import { useSocketData } from "./useSocketData";
import { useAnalyticsData } from "./useAnalyticsData";

const API_BASE = "/api";
const SOCKET_URL = "https://hiring-dev.internal.kloudspot.com";


const calculateTrend = (current, previous) => {
    if (previous === undefined || previous === null || isNaN(previous)) return { label: "--", isPositive: true };
    if (previous === 0) return current === 0 ? { label: "0%", isPositive: true } : { label: "+100%", isPositive: true };
    
    const diff = current - previous;
    const percentage = (diff / previous) * 100;
    const rounded = Math.round(percentage);
    const label = `${rounded > 0 ? "+" : ""}${rounded}%`;
    return { label, isPositive: rounded >= 0 };
};

export const useDashboardAnalytics = () => {
  const { sites, selectedSite, setSelectedSite } = useSites(API_BASE);
  const { liveOccupancy, alerts } = useSocketData(SOCKET_URL);
  
  
  const { 
    stats: historicalStats, 
    occupancyData, 
    demographicsTrend, 
    demographicsPie 
  } = useAnalyticsData(API_BASE, selectedSite);


  const occTrend = calculateTrend(liveOccupancy, historicalStats.historicalOccupancy);

  const finalStats = {
    ...historicalStats,
    occupancy: liveOccupancy, 
    occupancyTrend: occTrend.label,
    occupancyPos: occTrend.isPositive
  };

  return { 
    sites, 
    selectedSite, 
    setSelectedSite, 
    stats: finalStats, 
    alerts, 
    occupancyData, 
    demographicsTrend, 
    demographicsPie 
  };
};