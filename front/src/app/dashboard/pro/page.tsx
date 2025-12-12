'use client';
import MyListings from '@/components/sections/Users/MyListings';
import ReviewBanner from '@/components/sections/Users/ReviewBanner';
import DashboardProCta from '@/components/sections/Users/DashboardProCta';
import MyAuctions from '@/components/sections/Users/MyAuctions';
import { SearchBar } from '@/components/ui';
import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { useAuth } from '@/hooks/useAuth';
import CategoriesSection from '@/components/sections/Categories';

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