import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useFirestoreDocument = (collectionName, documentId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
          console.log(`useFirestoreDocument: Fetched data for ${collectionName}/${documentId}.`);
        } else {
          setData(null);
          console.log(`useFirestoreDocument: No document found for ${collectionName}/${documentId}.`);
        }
      } catch (err) {
        console.error(`useFirestoreDocument: Error fetching document ${collectionName}/${documentId}:`, err);
        setError(`無法載入 ${collectionName} 內容，請稍後再試。`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, documentId]);

  return { data, loading, error };
};

export default useFirestoreDocument;
