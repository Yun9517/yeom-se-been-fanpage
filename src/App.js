import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import About from './components/About';
import PhotoGallery from './components/PhotoGallery';
import VideoGallery from './components/VideoGallery';
import Footer from './components/Footer';
import Profile from './components/Profile';
import News from './components/News';

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: "100vw",
    scale: 1.2
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}><About /></motion.div>} />
        <Route path="/gallery" element={<motion.div variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}><PhotoGallery /></motion.div>} />
        <Route path="/videos" element={<motion.div variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}><VideoGallery /></motion.div>} />
        <Route path="/profile" element={<motion.div variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}><Profile /></motion.div>} />
        <Route path="/news" element={<motion.div variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}><News /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: true, // whether animation should happen only once - while scrolling down
    });
  }, []);

  return (
    <Router basename="/yeom-se-bin-fanpage">
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
