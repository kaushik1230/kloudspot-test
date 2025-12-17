import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export const useSocketData = (socketUrl) => {
  const [liveOccupancy, setLiveOccupancy] = useState(0);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = io(socketUrl, { transports: ["websocket"], auth: { token } });

    socket.on("live_occupancy", (data) => {
      const val = typeof data === "object" ? data.siteOccupancy || data.count || 0 : data;
      setLiveOccupancy(val);
    });

    socket.on("alert", (data) => {
      setAlerts((prev) => [{
        title: `${data.personName || "Unknown"} ${data.direction || ""}`,
        zone: data.zoneName || "Zone",
        severity: data.severity || "info",
        timestamp: data.ts || new Date().toISOString(),
      }, ...prev]);
    });

    return () => socket.disconnect();
  }, [socketUrl]);

  return { liveOccupancy, alerts };
};