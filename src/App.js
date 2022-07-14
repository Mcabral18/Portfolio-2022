import './App.css';
import React, { useState } from "react";
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Home from "./pages-blocks/Home";
import About from "./pages-blocks/About";
import Experience from "./pages-blocks/Experience";
import Portfolio from "./pages-blocks/Portfolio";
import Contact from "./pages-blocks/Contact";
import Footer from "./components/Footer";

function App() {

  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <div className="main">
      {/* Import Preloader */}
      {animationComplete === false && <Preloader setAnimationComplete={setAnimationComplete} />}
      {/* Import Navbar */}
      <Navbar />
      <Home />
      <About />
      <Experience />
      <Portfolio />
      <Contact />
      <Footer />
      {/* Page Layout */}
      {/* Import Footer */}

    </div>
  );
}

export default App;
