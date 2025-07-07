import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import About from './components/About';
import PhotoGallery from './components/PhotoGallery';
import VideoGallery from './components/VideoGallery';
import Footer from './components/Footer';

function App() {
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