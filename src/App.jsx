import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import TechSolutions from "./components/TechSolutions";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useTheme } from "./hooks";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  const [dark, setDark] = useTheme();

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-300">
        <Navbar dark={dark} setDark={setDark} />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <TechSolutions />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
      <SpeedInsights />
    </div>
  );
}
