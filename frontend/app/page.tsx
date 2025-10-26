import { Navbar } from '@/components/sections/navbar';
import { Hero } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';
import { ApiDocsSection } from '@/components/sections/ApiDocs';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutSection />
      {/*SkillsSection*/}
      {/*ExperienceSection*/}
      <ProjectsSection />
      
      <ContactSection />
      <ApiDocsSection />
      <Footer/>
      
      {/* Placeholder */}
      
    </main>
  );
}