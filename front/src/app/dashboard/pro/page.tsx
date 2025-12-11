import React from 'react';
import { MyListings, ReviewBanner,  DashboardProCta, MyAuctions, CategoriesSection } from '@/components/sections/Index';
import { SearchSection } from '@/components/ui';

export default function DashboardParticulierHome() {
  return (
    <main>
      <DashboardProCta />
      <SearchSection />
      <MyListings />
      <MyAuctions />
      <ReviewBanner />
      <CategoriesSection />
    </main> 
  
  )
}