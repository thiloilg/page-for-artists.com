import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { DemoPreview } from './components/DemoPreview';
import { Checkout } from './pages/Checkout';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <DemoPreview />
                <Features />
              </>
            } />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
