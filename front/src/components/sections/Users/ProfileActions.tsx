import React from 'react';
import {Button} from '@/components/ui';

interface ProfileActionsProps {
  onSave?: () => void;
  onCancel?: () => void;
  onDeleteAccount?: () => void;
  className?: string;
}

export default function ProfileActions({
  onSave,
  onCancel,
  onDeleteAccount,
  className = ''
}: ProfileActionsProps) {
  return (
    <>
  
      <div id="action-buttons" className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 justify-center ${className}`}>
        <Button
          onClick={onSave}
          variant="primary"
          size="lg"
          className="uppercase tracking-wider"
          href="#"
        >
          Enregistrer les modifications
        </Button>
        <Button
        
          onClick={onCancel}
          variant="outline"
          href="#"
          size="lg"
          className="flex-1 sm:flex-none uppercase tracking-wider"
        >
          Annuler
        </Button>
      </div>

    
      <div id="danger-zone" className="text-center py-6 border-t border-purple-dark/10">
        <button
          onClick={onDeleteAccount}
          className="text-navy-deep/40 hover:text-navy-deep/60 text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer"
        >
          Supprimer mon compte
        </button>
      </div>
    </>
  );
}