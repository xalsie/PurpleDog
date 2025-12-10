/**
 * Page d'accueil simple Purple Dog
 */

export default function HomePage({}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-purple-900 to-purple-700 text-white">
      <div className="max-w-lg w-full px-6 py-12 bg-white/10 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur Purple Dog</h1>
        <p className="text-lg mb-8 text-purple-100">
          Plateforme de gestion pour particuliers et professionnels.
        </p>
        <div className="flex flex-col gap-4">
          <a href="/login" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            Se connecter
          </a>
          <a href="/register" className="bg-white/80 hover:bg-white text-purple-700 font-semibold py-2 px-4 rounded-lg transition">
            S'inscrire
          </a>
        </div>
      </div>
      <footer className="mt-12 text-xs text-purple-200">
        &copy; {new Date().getFullYear()} Purple Dog. Tous droits réservés.
      </footer>
    </main>
  );
}