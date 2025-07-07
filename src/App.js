import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Header from './components/Header';
import About from './components/About';
import PhotoGallery from './components/PhotoGallery';
import VideoGallery from './components/VideoGallery';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: true, // whether animation should happen only once - while scrolling down
    });
  }, []);

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <About />
        <PhotoGallery />
        <VideoGallery />
      </main>
      <Footer />
    </div>
  );
}

export default App;
