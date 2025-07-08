import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import PhotoGallery from './components/PhotoGallery';
import VideoGallery from './components/VideoGallery';
import Profile from './components/Profile';
import News from './components/News';

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<PhotoGallery />} />
            <Route path="/videos" element={<VideoGallery />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
