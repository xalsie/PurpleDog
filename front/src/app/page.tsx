import NavbarHome from "@/layout/NavBarHome/NavBarHome";
import NavBarDashboard from "@/layout/NavBarDashboard/NavBarDashboard";

export default function HomePage({}) {
  return (
    <div className="flex  w-full flex-col bg-zinc-50 font-sans">
      <NavbarHome/>
      <NavBarDashboard UserType="Professional"/>
    </div>
  );
}