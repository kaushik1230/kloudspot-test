import { useState, useEffect } from "react";

export const useSites = (apiBase) => {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    const fetchSites = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${apiBase}/sites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSites(data);
          if (data.length > 0) setSelectedSite(data[0]);
        }
      } catch (e) { console.error("Error fetching sites:", e); }
    };

    fetchSites();
  }, [apiBase]);

  return { sites, selectedSite, setSelectedSite };
};