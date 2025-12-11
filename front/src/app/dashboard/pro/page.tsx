'use client';
import React from 'react';
import { MyListings, ReviewBanner,  DashboardProCta, MyAuctions, CategoriesSection } from '@/components/sections/Index';
import { SearchSection } from '@/components/ui';
import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardParticulierHome() {
  const { user, logout } = useAuth();
  return (
    <main>
       <NavBarDashboard 
                  UserType={user?.role}
                  logOut={logout}
                  />
      <DashboardProCta />
      <SearchSection />
      <MyListings />
      <MyAuctions />
      <ReviewBanner />
      <CategoriesSection />
    </main> 
  
  )
}