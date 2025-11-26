import React, { useEffect, Suspense } from 'react';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, useLocation, Routes } from 'react-router-dom';
import ReactGA from 'react-ga4';
import ScrollToTop from './components/ScrollToTop';
import packageJson from '../package.json'; // Import package.json

import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import AppRoutes from './routes';

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
                      <Routes>{AppRoutes}</Routes>
                    </Suspense>        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
