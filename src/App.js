import React, { useEffect, Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import ScrollToTop from './components/ScrollToTop';
import packageJson from '../package.json'; // Import package.json

import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const PhotoGallery = lazy(() => import('./components/PhotoGallery'));
const VideoGallery = lazy(() => import('./components/VideoGallery'));
const CareerJourney = lazy(() => import('./components/CareerJourney'));
const News = lazy(() => import('./components/News'));
const FanQuiz = lazy(() => import('./components/FanQuiz'));
const QuizHistory = lazy(() => import('./components/QuizHistory'));
const Achievements = lazy(() => import('./components/Achievements'));
const RedemptionStore = lazy(() => import('./components/RedemptionStore'));
const MessageCenter = lazy(() => import('./components/MessageCenter'));
const ChatRoom = lazy(() => import('./components/ChatRoom'));
const ChatPage = lazy(() => import('./components/ChatPage')); // Changed from BeenTalk

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

    // Log app version
    console.log(`Yeom Se-been Fanpage v${packageJson.version} is running.`);

  }, []);

  return (
    <Router basename="/yeom-se-been-fanpage">
      <ScrollToTop />
      <PageTracker />
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1 pb-3">
          <Suspense fallback={<LoadingSpinner loading={true} />}>
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
              <Route path="/store" element={<RedemptionStore />} />
              <Route path="/messages" element={<MessageCenter />} />
              <Route path="/chatroom" element={<ChatRoom />} />
              <Route path="/beentalk" element={<ChatPage />} /> {/* Changed from BeenTalk */}
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
