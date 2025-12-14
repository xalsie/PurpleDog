'use client'

import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="bg-cream-light border-t border-purple-dark/10">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-3 items-end">
          {/* Attach Button */}
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-black-deep/60 hover:text-black-deep transition flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Input Container */}
          <div className="flex-1 flex items-center gap-2 bg-white border border-purple-dark/10 rounded-lg px-4 py-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrire un message..."
              disabled={disabled}
              className="flex-1 bg-transparent text-black-deep placeholder:text-black-deep/40 focus:outline-none disabled:opacity-50"
            />
            
            {/* Image Icon */}
            <button
              type="button"
              className="text-black-deep/60 hover:text-black-deep transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            {/* Emoji Icon */}
            <button
              type="button"
              className="text-black-deep/60 hover:text-black-deep transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="px-6 py-3 bg-purple-dark text-cream-light rounded-lg hover:bg-black-deep transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            Envoyer
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center pb-3">
        <p className="text-xs text-black-deep/40">
          Les conversations sont chiffrées de bout en bout
        </p>
      </div>
    </div>
  );
}