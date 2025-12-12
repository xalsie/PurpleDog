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
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }
  
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }
  return (
    <main>
      <NavBarDashboard UserType={user?.role} logOut={logout}/>
      <DashboardProCta />
      <div>
        <SearchBar searchQuery={searchQuery} filters={filters} onSearchChange={handleSearchChange} onFiltersChange={handleFiltersChange} />
      </div>
      <MyListings />
      <MyAuctions />
      <ReviewBanner />
      <CategoriesSection />
    </main> 
  
  )
}