'use client'

import React, { useState } from 'react';
import Image from 'next/image';

interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar: string;
    initials: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
  };
  unreadCount: number;
  productImage?: string;
}

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation?: () => void;
}

export default function ConversationsList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-black-deep h-full flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h1 className="font-cormorant text-cream-light text-3xl mb-6">Purple dog</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une conversation"
            className="w-full bg-purple-dark/30 text-cream-light placeholder:text-cream-light/40 px-4 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-dark"
          />
          <svg 
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-light/60" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-cream-light/60 text-sm">Aucune conversation</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full p-4 hover:bg-purple-dark/20 transition text-left ${
                activeConversationId === conversation.id ? 'bg-purple-dark/30' : ''
              }`}
            >
              <div className="flex gap-3 items-start">
                {/* Avatar with Initials */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-purple-dark flex items-center justify-center text-cream-light font-medium">
                    {conversation.participant.initials}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-dark text-cream-light text-xs rounded-full flex items-center justify-center border-2 border-black-deep">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-cream-light truncate">
                      {conversation.participant.name}
                    </h3>
                    <span className="text-xs text-cream-light/60 flex-shrink-0 ml-2">
                      {conversation.lastMessage.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-cream-light/70 truncate">
                    {conversation.lastMessage.text}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* New Conversation Button */}
      <div className="p-4">
        <button
          onClick={onNewConversation}
          className="w-full bg-purple-dark text-cream-light py-3 rounded-lg hover:bg-purple-dark/80 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nouvelle conversation</span>
        </button>
      </div>
    </div>
  );
}