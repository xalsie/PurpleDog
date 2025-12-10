<<<<<<< Updated upstream
import NavbarHome from "@/layout/NavBarHome/NavBarHome";
import NavBarDashboard from "@/layout/NavBarDashboard/NavBarDashboard";

export default function HomePage({}) {
  return (
    <div className="flex  w-full flex-col bg-zinc-50 font-sans">
      <NavbarHome/>
      <NavBarDashboard UserType="Professional"/>
    </div>
=======
import { HeroSection, FeaturedCarousel, CategoriesSection, ConceptSection, ServicesSection, NewsletterForm } from '@/components/sections/Index';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ConceptSection />
      <ServicesSection /> 
      <FeaturedCarousel />
      <CategoriesSection />
      <NewsletterForm /> 
    </main>
>>>>>>> Stashed changes
  );
} 

// TO DO : ajouter la logique d'inscription