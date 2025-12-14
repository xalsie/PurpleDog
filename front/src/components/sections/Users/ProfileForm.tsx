'use client';

import React, { useState } from 'react';
import {Input} from '@/components/ui';
import { NotificationsSwitch } from '../Index';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit?: (data: ProfileFormData) => void;
  className?: string;
}

export default function ProfileForm({ 
  initialData = {},
  onSubmit,
  className = '' 
}: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    currentPassword: initialData.currentPassword || '',
    newPassword: initialData.newPassword || '',
    confirmPassword: initialData.confirmPassword || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div id="profile-form-container" className={`max-w-2xl mx-auto bg-white/40 backdrop-blur-sm rounded-lg border border-purple-dark/10 p-6 sm:p-8 lg:p-10 mb-6 ${className}`}>
      <form onSubmit={handleSubmit}>
    
        <div id="personal-info-section" className="mb-8 sm:mb-10">
          <h2 className="font-cormorant text-2xl sm:text-3xl text-navy-deep mb-6 pb-3 border-b border-purple-dark/10">
            Informations personnelles
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Input
              label="Prénom"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              variant="light"
              className="bg-cream/50 border-purple-dark/20 focus:border-purple-dark/40"
            />
            <Input
              label="Nom"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              variant="light"
              className="bg-cream/50 border-purple-dark/20 focus:border-purple-dark/40"
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              variant="light"
              className="bg-cream/50 border-purple-dark/20 focus:border-purple-dark/40"
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              variant="light"
              className="bg-cream/50 border-purple-dark/20 focus:border-purple-dark/40"
            />
          </div>

          <div>
            <Input
              label="Adresse"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              variant="light"
              className="bg-cream/50 border-purple-dark/20 focus:border-purple-dark/40"
            />
          </div>
        </div>

       
        <div id="security-section" className="mb-8 sm:mb-10">
          <h2 className="font-cormorant text-2xl sm:text-3xl text-navy-deep mb-6 pb-3 border-b border-purple-dark/10">
            Sécurité
          </h2>
          
          <div className="mb-4 sm:mb-6">
            <Input
              label="Mot de passe actuel"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              variant="light"
              className="bg-cream/50 border-purple-dark/20 focus:border-purple-dark/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Input
              label="Nouveau mot de passe"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              variant="light"
              className="bg-cream/50 border-purple-dark/20 focus:border-purple-dark/40"
            />
            <Input
              label="Confirmer le mot de passe"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              variant="light"
              className="bg-cream/50 border-purple-dark/20 focus:border-purple-dark/40"
            />
          </div>
        </div>
        <NotificationsSwitch className="mb-8 sm:mb-10" />
      </form>
    </div>
  );
}