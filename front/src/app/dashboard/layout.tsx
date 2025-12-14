 "use client";

 import { useEffect } from "react";
 import { useRouter } from "next/navigation";
 import { useSelector } from "react-redux";
 import { useAuthReady } from "@/components/providers/AuthProvider";
 import { RootState } from "@/store";

 export default function DashboardLayout({
   children,
 }: {
   children: React.ReactNode;
 }) {
   const router = useRouter();
   const authReady = useAuthReady();
   const { isAuthenticated } = useSelector((state: RootState) => state.auth);
   const { isLoading: userLoading } = useSelector((state: RootState) => state.user);

   useEffect(() => {
     if (authReady && !isAuthenticated) {
       router.replace("/login");
     }
   }, [authReady, isAuthenticated, router]);

   if (!authReady || userLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 to-purple-700">
         <div className="text-center">
           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
           <p className="text-white mt-4">Chargement...</p>
         </div>
       </div>
     );
   }

   return (
     <>
     
       {children}
     </>
   );
 }
