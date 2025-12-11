import { HeroSection, FeaturedCarousel, CategoriesSection, ConceptSection, ServicesSection, NewsletterForm } from '@/components/sections/Index';
import NavbarHome from '@/components/layout/NavBarHome/NavBarHome';

export default function HomePage() {
  return (
    <main>
      <NavbarHome />
      <HeroSection />
      <ConceptSection />
      <ServicesSection /> 
      <FeaturedCarousel />
      <CategoriesSection />
      <NewsletterForm /> 
    </main>
  );
} 

// TO DO : ajouter la logique d'inscription à la newsletter