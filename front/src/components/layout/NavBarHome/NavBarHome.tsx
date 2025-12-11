"use client";

import Link from "next/link";

export default function NavbarHome() {
  return (
    <header className="sticky top-0 z-50 w-full bg-WhiteC text-VioletC border-b border-VioletC border">
      <div className="w-full mx-auto px-4 py-4 flex items-center justify-between">
        
        <div className="flex-1 md:text-center">
          <Link   
            href="#"
            className="text-xl font-regular tracking-wide md:text-3xl font-gamora"
          >
            Purple Dog
          </Link>
        </div>

        <div className="flex flex-row items-center gap-2 md:gap-4 md:justify-end">
          <Link
            href="/login"
            className="px-3 py-1.5 border border-VioletC text-VioletC text-sm md:text-base lg:text-lg hover:bg-VioletC/5 transition font-raleway"
          >
            Connexion
          </Link>

          <Link
            href="/register"
            className="px-3 py-1.5 bg-VioletC text-WhiteC text-sm md:text-base lg:text-lg hover:bg-VioletC/90 transition font-raleway"
          >
            Inscription
          </Link>
        </div>

      </div>
    </header>
  );
}
