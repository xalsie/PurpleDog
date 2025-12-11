"use client";
import NavBarDashboard from "@/components/layout/NavBarDashboard/NavBarDashboard";
import { useAuth } from "@/hooks/useAuth";
import MyListings from "@/components/sections/Users/MyListings";


export default function Favorites() {
  const { user, logout } = useAuth()

  return (
    <div>
      <NavBarDashboard UserType={user?.role} logOut={logout}/>
      <MyListings title="Mes favories" viewAllText={false} />
    </div>
  );
}


