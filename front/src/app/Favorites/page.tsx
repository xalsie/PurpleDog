"use client";
import NavBarDashboard from "@/components/layout/NavBarDashboard/NavBarDashboard";
import { useAuth } from "@/hooks/useAuth";
import { ProductCard } from "@/components/ui";


export default function Favorites() {
  const { user, logout } = useAuth()

  return (
    <div>
      <NavBarDashboard UserType={user?.role} logOut={logout}/>
      <div>
        <h2>Mes Favories</h2>
      </div>
    </div>
  );
}


