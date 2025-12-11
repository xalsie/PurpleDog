import NavbarHome from "@/components/layout/NavBarHome/NavBarHome";
import NavBarDashboard from "@/components/layout/NavBarDashboard/NavBarDashboard";

export default function HomePage({}) {
  return (
    <div className="flex  w-full flex-col bg-zinc-50 font-sans">
      <NavBarDashboard UserType="PROFESSIONAL"/>
      <NavbarHome/>
    </div>
  );
}