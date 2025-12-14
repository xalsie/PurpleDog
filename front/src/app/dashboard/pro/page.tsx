'use client'

import React, { useState } from 'react';
import { MyListings, ReviewBanner,  DashboardProCta, MyAuctions, CategoriesSection } from '@/components/sections/Index';
import { SearchBar } from '@/components/ui';
import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { useAuth } from '@/hooks/useAuth';

interface Filters {
  price: string;
  saleType: string;
  category: string;
  status: string;
}

export default function DashboardParticulierHome() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({
    price: '',
    saleType: '',
    category: '',
    status: '',
  })
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }
  
  const handleFiltersChange = (newFilters: Filters) => {
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
