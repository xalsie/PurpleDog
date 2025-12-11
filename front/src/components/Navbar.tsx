"use client";

import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-purple-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Purple Dog</h1>
          {user && (
            <div className="text-sm text-purple-100">
              Connecté en tant que: <span className="font-semibold">{user.email}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
