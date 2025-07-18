import React, { useEffect, Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import ScrollToTop from './components/ScrollToTop';

import Header from './components/Header';
import Footer from './components/Footer';

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const PhotoGallery = lazy(() => import('./components/PhotoGallery'));
const VideoGallery = lazy(() => import('./components/VideoGallery'));
const Profile = lazy(() => import('./components/Profile'));
const News = lazy(() => import('./components/News'));
const FanQuiz = lazy(() => import('./components/FanQuiz'));

// Component to track page views
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

function App() {
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/news" element={<News />} />
              <Route path="/quiz" element={<FanQuiz />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
