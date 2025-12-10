"use client";

import Link from "next/link";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-VioletC text-white px-6 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 rounded-md">
        <div
          className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-16"
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold">Purple Dog</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              La plateforme parisienne de référence pour la vente d’objets de
              luxe et les enchères d’exception.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">À Propos</h3>
            <ul className="text-sm opacity-80 flex flex-col gap-2">
              <li>
                <Link href="#">Qui sommes-nous</Link>
              </li>
              <li>
                <Link href="#">Notre expertise</Link>
              </li>
              <li>
                <Link href="#">Nos partenaires</Link>
              </li>
              <li>
                <Link href="#">Carrières</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="text-sm opacity-80 flex flex-col gap-2">
              <li>
                <Link href="#">Vendre un objet</Link>
              </li>
              <li>
                <Link href="#">Acheter</Link>
              </li>
              <li>
                <Link href="#">Expertise gratuite</Link>
              </li>
              <li>
                <Link href="#">Enchères en ligne</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Contact</h3>

            <ul className="text-sm opacity-80 flex flex-col gap-2">
              <li>
                <Link href="#">Nous contacter</Link>
              </li>
              <li>
                <Link href="#">Service client</Link>
              </li>
              <li>
                <Link href="#">FAQ</Link>
              </li>
            </ul>

            <div className="flex items-center gap-4 pt-2">
              <Link href="#" aria-label="Instagram">
                <FaInstagram className="text-xl hover:opacity-70 transition" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <FaFacebookF className="text-xl hover:opacity-70 transition" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <FaLinkedinIn className="text-xl hover:opacity-70 transition" />
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-white/20 my-8"></div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-sm opacity-80">
            © 2024 Purple Dog. Tous droits réservés.
          </p>

          <div className="flex gap-6 text-sm opacity-80">
            <Link href="#">Mentions légales</Link>
            <Link href="#">Politique de confidentialité</Link>
            <Link href="#">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
