import { ContentProvider } from "@/components/ContentProvider";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Mission from "@/components/sections/Mission";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import TechGalaxy from "@/components/sections/TechGalaxy";
import Timeline from "@/components/sections/Timeline";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { getContent } from "@/lib/content";

// Re-fetch editable content from the backend at most once a minute (ISR).
export const revalidate = 60;

export default async function Home() {
  const content = await getContent();
  return (
    <ContentProvider value={content}>
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <Projects />
        <TechGalaxy />
        <Timeline />
        <Process />
        <Contact />
      </main>
      <Footer />
    </ContentProvider>
  );
}
