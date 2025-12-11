'use client';

import React, { useState } from 'react';
import {ToggleSwitch} from '@/components/ui';

interface NotificationPreferences {
  newsAndOffers: boolean;
  orderConfirmations: boolean;
  exclusiveEvents: boolean;
  monthlyNewsletter: boolean;
}

interface NotificationsSettingsProps {
  initialPreferences?: Partial<NotificationPreferences>;
  onChange?: (preferences: NotificationPreferences) => void;
  className?: string;
}

export default function NotificationsSettings({
  initialPreferences = {},
  onChange,
  className = ''
}: NotificationsSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    newsAndOffers: initialPreferences.newsAndOffers ?? true,
    orderConfirmations: initialPreferences.orderConfirmations ?? true,
    exclusiveEvents: initialPreferences.exclusiveEvents ?? false,
    monthlyNewsletter: initialPreferences.monthlyNewsletter ?? true,
  });

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    onChange?.(newPreferences);
  };

  return (
    <div id="notifications-section" className={className}>
      <h2 className="font-cormorant text-2xl sm:text-3xl text-navy-deep mb-6 pb-3 border-b border-purple-dark/10">
        Notifications
      </h2>
      
      <div className="space-y-4">
        <ToggleSwitch
          label="Nouveautés et offres"
          description="Recevez nos dernières collections"
          checked={preferences.newsAndOffers}
          onChange={(checked) => handleToggle('newsAndOffers', checked)}
        />

        <ToggleSwitch
          label="Confirmations de commande"
          description="Notifications importantes"
          checked={preferences.orderConfirmations}
          onChange={(checked) => handleToggle('orderConfirmations', checked)}
        />

        <ToggleSwitch
          label="Événements exclusifs"
          description="Invitations privées"
          checked={preferences.exclusiveEvents}
          onChange={(checked) => handleToggle('exclusiveEvents', checked)}
        />

        <ToggleSwitch
          label="Newsletter mensuelle"
          description="Conseils et inspirations"
          checked={preferences.monthlyNewsletter}
          onChange={(checked) => handleToggle('monthlyNewsletter', checked)}
        />
      </div>
    </div>
  );
}