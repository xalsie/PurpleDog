"use client";
import NavBarDashboard from "@/components/layout/NavBarDashboard/NavBarDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useEffect,useState } from "react";
import MyListings from "@/components/sections/Users/Favorites/MyListingsFavorite";
import { GetFavorites } from "@/lib/api";
import { FavoritesResult } from "@/types";
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import   { Button } from "@/components/ui/"


export default function Favorites() {
  const { user, logout } = useAuth()
  const [Result, setResult] = useState<FavoritesResult>({
    data: null,
    isLoading: false,
    error: null,
  });

  const Redirect = () => { 
    // router.push("./dashboard/pro/listing")
    console.log('next')
  }

  useEffect(()=> {
    if (!user?.id) return;
    let mounted = true;
    async function getdata(){
      setResult((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const res = await GetFavorites(String(user.id));
        if (!mounted) return;
        setResult(res);
      } catch (e) {
        if (!mounted) return;
        setResult((s) => ({ ...s, error: (e as Error).message ?? 'Erreur', data: null }));
      } finally {
        if (mounted) setResult((s) => ({ ...s, isLoading: false }));
      }
    }
    getdata();
    return () => { mounted = false; };
  },[user?.id])


  return (
    <div>
      <NavBarDashboard UserType={user?.role} logOut={logout}/>
      <LoadingOverlay show={Result.isLoading} />

      {!Result.isLoading && Result.error && (
        <div className="py-12 text-center my-14">
          <h1 className="font-cormorant text-2xl text-red-600 mb-4">Erreur: {Result.error}</h1>
        </div>
      )}

      {!Result.isLoading && !Result.error && (!Result.data || (Result.data.data?.length ?? 0) === 0) && (
        <div className="py-12 text-center my-14">
          <h1 className="font-cormorant text-3xl text-purple-dark my-6">Aucun favoris pour le moment</h1>
          <Button variant="primary" size="md" onClick={Redirect}>Voir les Annonces</Button>
        </div>
      )}

      {!Result.isLoading && !Result.error && Result.data && (Result.data.data?.length ?? 0) > 0 && (
        <MyListings title="Mes favories" viewAllText={false} listings={Result.data.data} />
      )}
    </div>
  );
}


