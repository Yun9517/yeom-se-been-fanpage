import { useState, useEffect } from 'react';
import { collection, query, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // 假設你的 firebase.js 導出了 db

const useFirestoreCollection = (collectionName, queryConstraints = [], liveUpdate = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null); // Clear previous errors

    const collectionRef = collection(db, collectionName);
    let q = query(collectionRef, ...queryConstraints); // 應用傳入的查詢約束

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
        console.log(`useFirestoreCollection: Fetched data from ${collectionName}.`);
      } catch (err) {
        console.error(`useFirestoreCollection: Error fetching data from ${collectionName}:`, err);
        setError(`無法載入 ${collectionName} 資料，請稍後再試。`);
      } finally {
        setLoading(false);
      }
    };

    const setupLiveListener = () => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
        setLoading(false);
        setError(null);
        console.log(`useFirestoreCollection: Live update from ${collectionName}.`);
      }, (err) => {
        console.error(`useFirestoreCollection: Live update error for ${collectionName}:`, err);
        setError(`即時更新 ${collectionName} 資料失敗。`);
        setLoading(false);
      });
      return unsubscribe;
    };

    let unsubscribe = null;
    if (liveUpdate) {
      unsubscribe = setupLiveListener();
    } else {
      fetchData();
    }

    // Cleanup function for useEffect
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Unsubscribe from live listener if it was set up
      }
    };
  }, [collectionName, queryConstraints, liveUpdate]); // 依賴項，當這些改變時重新執行 effect

  return { data, loading, error };
};

export default useFirestoreCollection;
