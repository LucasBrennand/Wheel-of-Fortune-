import { useState, useEffect } from "react";
import axios from "axios";

export const useOfflineSync = () => {
  const [queue, setQueue] = useState(() => {
    const saved = localStorage.getItem("spin_queue");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const syncData = async () => {
      if (queue.length === 0 || !navigator.onLine) return;

      console.log(`Attempting to sync ${queue.length} pending leads...`);
      const item = queue[0];

      try {
        await axios.post("http://localhost:3000/api/claim", item);
        const newQueue = queue.slice(1);
        setQueue(newQueue);
        localStorage.setItem("spin_queue", JSON.stringify(newQueue));
      } catch (err) {
        console.error("Sync failed, will retry later", err);
      }
    };

    window.addEventListener("online", syncData);
    syncData();

    return () => window.removeEventListener("online", syncData);
  }, [queue]);

  const addToQueue = (data) => {
    const newQueue = [...queue, data];
    setQueue(newQueue);
    localStorage.setItem("spin_queue", JSON.stringify(newQueue));
  };

  return { addToQueue, pendingCount: queue.length };
};
