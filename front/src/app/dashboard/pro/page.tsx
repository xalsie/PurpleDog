'use client'

import { MyListings, ReviewBanner,  DashboardProCta, MyAuctions, CategoriesSection } from '@/components/sections/Index';
import { SearchBar } from '@/components/ui';
import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardParticulierHome() {
  const { user, logout } = useAuth()
  return (
    <main>
      <NavBarDashboard UserType={user?.role} logOut={logout}/>
      <DashboardProCta />
      <div>
        <SearchBar/>
      </div>
      <MyListings />
      <MyAuctions />
      <ReviewBanner />
      <CategoriesSection />
    </main> 
  
  )
}