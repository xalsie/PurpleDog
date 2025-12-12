'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Input, Container,ProfileAvatar } from '@/components/ui';
import { ProfileForm, ProfileActions } from '@/components/sections/Index';
import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState('https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg');
  
  const handleAvatarChange = () => {
    // Logique pour changer l'avatar
    console.log('Change avatar');
  };

    const { user, logout } = useAuth();
  return (<>
     <NavBarDashboard 
            UserType={user?.role}
            logOut={logout}
            />
    <Container size="lg">
      
      <div id="profile-header" className="text-center mb-8 sm:mb-12">
        <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-navy-deep mb-2">
          Mon Profil
        </h1>
        <p className="text-navy-deep/60 text-sm sm:text-base">
          Gérez vos informations personnelles
        </p>
      </div>
        <ProfileAvatar
          initialAvatarUrl={avatarUrl}
          onAvatarChange={(file) => {
            // Handle avatar change logic here
            const objectUrl = URL.createObjectURL(file);
            setAvatarUrl(objectUrl);
          }}
        />
        <ProfileForm />
        <ProfileActions className="mt-8 sm:mt-12" />
    </Container>
  </>);
}