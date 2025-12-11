'use client';
import React from 'react';
import { DashboardCTA, MyListings, ReviewBanner } from '@/components/sections/Index';
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
      <DashboardCTA />
      <MyListings />
      <ReviewBanner />
    </main> 
  
  )
}