'use client'

import React from 'react';
import Image from 'next/image';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface MessageThreadProps {
  messages: Message[];
  participant: {
    name: string;
    avatar: string;
    initials: string;
    status?: string;
  };
  product?: {
    title: string;
    image: string;
    price: number;
  };
}

export default function MessageThread({
  messages,
  participant,
  product,
}: MessageThreadProps) {
  return (
    <div className="flex flex-col h-full bg-cream-light">
      {/* Header */}
      <div className="bg-cream-light border-b border-purple-dark/10 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-dark flex items-center justify-center text-cream-light font-medium flex-shrink-0">
            {participant.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-black-deep">{participant.name}</h3>
            {participant.status && (
              <p className="text-sm text-black-deep/60">{participant.status}</p>
            )}
          </div>
          <button className="text-black-deep/60 hover:text-black-deep">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Date Separator */}
        <div className="flex justify-center mb-4">
          <span className="text-xs text-black-deep/60 bg-black-deep/5 px-3 py-1 rounded-full">
            Aujourd'hui
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-black-deep/60 text-sm">Aucun message</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar for other person */}
              {!message.isOwn && (
                <div className="w-8 h-8 rounded-full bg-purple-dark flex items-center justify-center text-cream-light text-xs font-medium flex-shrink-0">
                  {participant.initials}
                </div>
              )}

              {/* Message Bubble */}
              <div className="flex flex-col max-w-[70%] sm:max-w-md">
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.isOwn
                      ? 'bg-purple-dark text-cream-light rounded-br-sm'
                      : 'bg-black-deep/5 text-black-deep rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed">{message.text}</p>
                </div>
                <p
                  className={`text-xs mt-1 px-1 ${
                    message.isOwn ? 'text-right text-black-deep/60' : 'text-black-deep/60'
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>

              {/* "Vous" badge for own messages */}
              {message.isOwn && (
                <div className="w-8 h-8 rounded-full bg-purple-dark flex items-center justify-center text-cream-light text-xs font-medium flex-shrink-0">
                  Vous
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}