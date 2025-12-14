'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ProfileAvatarProps {
  initialAvatarUrl?: string;
  onAvatarChange?: (file: File) => void;
  className?: string;
}

export default function ProfileAvatar({ 
  initialAvatarUrl = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
  onAvatarChange,
  className = ''
}: ProfileAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Créer une URL temporaire pour prévisualiser l'image
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      
      // Appeler le callback si fourni
      onAvatarChange?.(file);
    }
  };

  return (
    <div id="profile-avatar-section" className={`flex justify-center mb-8 sm:mb-12 ${className}`}>
      <div className="relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-purple-dark/10 border-2 border-purple-dark/20 flex items-center justify-center overflow-hidden">
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
        
        <button
          type="button"
          onClick={handleAvatarClick}
          className="absolute bottom-2 right-2 p-2 bg-purple-dark rounded-lg hover:bg-black-deep transition"
          aria-label="Changer l'avatar"
        >
          <svg 
            className="w-5 h-5 text-cream-light" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
            />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}