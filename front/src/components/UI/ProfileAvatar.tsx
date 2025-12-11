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
          className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-dark rounded-full flex items-center justify-center border-2 border-cream hover:bg-purple-dark/90 transition"
          aria-label="Changer l'avatar"
        >
          <i className="fa-solid fa-camera text-cream text-xs sm:text-sm"></i>
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