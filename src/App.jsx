import { SpeedInsights } from "@vercel/speed-insights/react"
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { useTheme } from "./hooks";
import { SpeedInsights } from '@vercel/speed-insights/react';





export default function App() {
  const [dark, setDark] = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={dark ? "dark" : ""}>
      <Loader visible={loading} />
      {!loading && (
        <div className="min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-300">
          <Navbar dark={dark} setDark={setDark} />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
}
