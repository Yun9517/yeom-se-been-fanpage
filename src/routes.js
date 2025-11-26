import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

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
const ChatPage = lazy(() => import('./components/ChatPage'));

const AppRoutes = (
  <>
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
    <Route path="/beentalk" element={<ChatPage />} />
  </>
);

export default AppRoutes;
