"use client";

import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface AvatarDropdownProps {
  name: string;
  photoUrl?: StaticImageData;
  onLogout: () => void;
}

export default function AvatarDropdown({ name, photoUrl, onLogout }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center p-1 sm:p-2 rounded-lg"
      >
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-VioletC"
        >
          {photoUrl ? (
            <Image src={photoUrl} alt={name} width={50} height={50} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-violet-400 flex items-center justify-center text-white text-xl sm:text-4xl">
              <FaUserCircle />
            </div>
          )}
        </div>
        <p className="mt-0.5 sm:mt-1 text-sm sm:text-lg font-light text-VioletC">
            {name}
        </p>
      </button>

      {open && (
        <div 
          className="absolute -left-1/2 transform -translate-x-1/2 mt-1 sm:mt-2 w-40 sm:w-48 bg-white shadow-xl rounded-lg border border-gray-200 z-50"
        >
          <ul className="flex flex-col">
            <li>
              <Link
                href="/dashboard/profile"
                className="block px-3 py-2 sm:px-4 sm:py-2 text-sm text-gray-700 hover:bg-gray-100 transition md:text-base lg:text-lg"
              >
                Paramètres
              </Link>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 sm:px-4 sm:py-2 text-sm text-red-600 hover:bg-red-50 transition md:text-base lg:text-lg"
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}