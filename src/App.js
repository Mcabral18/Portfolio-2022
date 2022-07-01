import './App.css';
import React, { useState } from "react";
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Home from "./pages-blocks/Home";
import About from "./pages-blocks/About";
import Experience from "./pages-blocks/Experience";


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
      {/* Page Layout */}
      {/* Import Footer */}

    </div>
  );
}

export default App;
