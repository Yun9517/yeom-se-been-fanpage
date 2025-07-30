import React, { useEffect, Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import ScrollToTop from './components/ScrollToTop';
import { auth, db } from './firebase'; // Import auth and db
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // Import firestore functions
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState
import packageJson from '../package.json'; // Import package.json

import Header from './components/Header';
import Footer from './components/Footer';

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const PhotoGallery = lazy(() => import('./components/PhotoGallery'));
const VideoGallery = lazy(() => import('./components/VideoGallery'));
const CareerJourney = lazy(() => import('./components/CareerJourney'));
const News = lazy(() => import('./components/News'));
const FanQuiz = lazy(() => import('./components/FanQuiz'));
const QuizHistory = lazy(() => import('./components/QuizHistory'));
const Achievements = lazy(() => import('./components/Achievements'));

// Component to track page views
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

function App() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    const checkEarlySupporterAchievement = async () => {
      if (user && !user.isAnonymous) {
        const achievementId = 'earlySupporter';
        const userAchievementsRef = doc(db, 'userAchievements', user.uid);
        const docSnap = await getDoc(userAchievementsRef);

        if (!docSnap.exists() || !docSnap.data()[achievementId]) {
          const cutoffDate = new Date('2025-08-31');
          const now = new Date();

          if (now <= cutoffDate) {
            await setDoc(userAchievementsRef, {
              [achievementId]: true,
              [`${achievementId}Date`]: serverTimestamp()
            }, { merge: true });
          }
        }
      }
    };

    checkEarlySupporterAchievement();
  }, [user]);

  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: true, // whether animation should happen only once - while scrolling down
    });

    // Remove loading indicator after app is mounted
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }

    // Log app version
    console.log(`Yeom Se-been Fanpage v${packageJson.version} is running.`);

  }, []);

  return (
    <Router basename="/yeom-se-been-fanpage">
      <ScrollToTop />
      <PageTracker />
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Suspense fallback={<div>載入中...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<PhotoGallery />} />
              <Route path="/videos" element={<VideoGallery />} />
              <Route path="/profile" element={<CareerJourney />} />
              <Route path="/news" element={<News />} />
              <Route path="/quiz" element={<FanQuiz />} />
              <Route path="/quiz-history" element={<QuizHistory />} />
              <Route path="/achievements" element={<Achievements />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;