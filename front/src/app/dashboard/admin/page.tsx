export default function DashboardAdminHome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-purple-900 to-purple-700 text-white">
      <div className="max-w-xl w-full px-8 py-12 bg-white/10 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Bienvenue sur le dashboard Admin</h1>
        <p className="text-lg mb-8 text-purple-100">
          Gérez la plateforme, les utilisateurs et les ventes.
        </p>
        <div className="flex flex-col gap-4">
          <a href="/dashboard/admin/utilisateurs" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition">Gestion utilisateurs</a>
          <a href="/dashboard/admin/ventes" className="bg-white/80 hover:bg-white text-purple-700 font-semibold py-2 px-4 rounded-lg transition">Gestion ventes</a>
          <a href="/dashboard/admin/stats" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition">Statistiques</a>
        </div>
      </div>
    </main>
  );
}