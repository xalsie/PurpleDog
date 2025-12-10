"use client";

import Link from "next/link";

export default function NavbarHome() {
  return (
    <header className="w-full bg-WhiteC text-VioletC border-b border-BeigeC border">
      <div className="w-full mx-auto px-4 py-4 flex flex-row items-center justify-between gap-4">
        
        <Link   
          href="#"
          className="text-xl font-semibold tracking-wide md:text-2xl"
        >
          Purple Dog
        </Link>

        <div className="flex flex-row items-center gap-2 md:gap-4">
          <Link
            href="#"
            className="px-3 py-1.5 border border-VioletC text-VioletC rounded-sm text-sm hover:bg-VioletC/5 transition"
          >
            Connexion
          </Link>

          <Link
            href="#"
            className="px-3 py-1.5 bg-VioletC text-white rounded-sm text-sm hover:bg-VioletC/90 transition"
          >
            Inscription
          </Link>
        </div>

      </div>
    </header>
  );
}
