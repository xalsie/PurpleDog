// 'use client'

// import React, { useEffect, useState } from 'react';
// import {MessageInput, MessageThread, ConversationsList} from '@/components/sections/Index';
// import { useAuth } from '@/hooks/useAuth';
// import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';


// interface Conversation {
//   id: string;
//   participant: {
//     name: string;
//     avatar: string;
//     initials: string;
//   };
//   lastMessage: {
//     text: string;
//     timestamp: string;
//   };
//   unreadCount: number;
//   productImage?: string;
// }

// interface Message {
//   id: string;
//   senderId: string;
//   text: string;
//   timestamp: string;
//   isOwn: boolean;
// }

// interface ConversationDetail {
//   id: string;
//   participant: {
//     name: string;
//     avatar: string;
//     initials: string;
//     status?: string;
//   };
//   messages: Message[];
//   product?: {
//     title: string;
//     image: string;
//     price: number;
//   };
// }

// export default function MessagingPage() {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
//   const [activeConversation, setActiveConversation] = useState<ConversationDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//     const { user, logout } = useAuth();
    

//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         setLoading(true);
//         // TODO: Remplacer par votre API
//         const response = await fetch('/api/conversations');
        
//         if (response.ok) {
//           const data = await response.json();
//           setConversations(data);
          
//           if (data.length > 0) {
//             setActiveConversationId(data[0].id);
//           }
//         } else {
//           // Use demo data
//           setConversations(demoConversations);
//           setActiveConversationId(demoConversations[0]?.id);
//         }
//       } catch (err) {
//         console.error('Error fetching conversations:', err);
//         // Use demo data on error
//         setConversations(demoConversations);
//         setActiveConversationId(demoConversations[0]?.id);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConversations();
//   }, []);

//   useEffect(() => {
//     if (!activeConversationId) return;

//     const fetchConversationDetail = async () => {
//       try {
//         // TODO: Remplacer par votre API
//         const response = await fetch(`/api/conversations/${activeConversationId}`);
        
//         if (response.ok) {
//           const data = await response.json();
//           setActiveConversation(data);
//         } else {
//           // Use demo data
//           const demo = demoConversationDetails.find(c => c.id === activeConversationId);
//           setActiveConversation(demo || null);
//         }
//       } catch (err) {
//         console.error('Error fetching conversation detail:', err);
//         // Use demo data on error
//         const demo = demoConversationDetails.find(c => c.id === activeConversationId);
//         setActiveConversation(demo || null);
//       }
//     };

//     fetchConversationDetail();
//   }, [activeConversationId]);

//   const handleSendMessage = async (text: string) => {
//     if (!activeConversationId) return;

//     try {
//       // TODO: Implémenter envoi de message
//       const response = await fetch('/api/messages', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           conversationId: activeConversationId,
//           text,
//         }),
//       });

//       if (response.ok) {
//         const newMessage = await response.json();
        
//         // Update local state
//         setActiveConversation((prev) => {
//           if (!prev) return prev;
//           return {
//             ...prev,
//             messages: [...prev.messages, newMessage],
//           };
//         });

//         // Update conversation last message
//         setConversations((prev) =>
//           prev.map((conv) =>
//             conv.id === activeConversationId
//               ? {
//                   ...conv,
//                   lastMessage: {
//                     text,
//                     timestamp: 'À l\'instant',
//                   },
//                 }
//               : conv
//           )
//         );
//       } else {
//         // Demo: Add message locally
//         const newMessage: Message = {
//           id: Date.now().toString(),
//           senderId: 'current-user',
//           text,
//           timestamp: 'À l\'instant',
//           isOwn: true,
//         };

//         setActiveConversation((prev) => {
//           if (!prev) return prev;
//           return {
//             ...prev,
//             messages: [...prev.messages, newMessage],
//           };
//         });
//       }
//     } catch (err) {
//       console.error('Error sending message:', err);
//     }
//   };

//   if (loading) {
//     return (
//       <main className="pt-16 sm:pt-20 h-screen">
//         <div className="h-full flex items-center justify-center">
//           <p className="text-purple-dark">Chargement...</p>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <>
//     <NavBarDashboard 
//                      UserType={user?.role}
//                      logOut={logout}
//                    />
//     <main className="pt-16 sm:pt-20 h-screen flex flex-col">
//       <div className="flex-1 overflow-hidden">
//         <div className="max-w-7xl mx-auto h-full">
//           <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
//             {/* Conversations List - Hidden on mobile when conversation is active */}
//             <div className={`lg:col-span-1 ${activeConversationId && 'hidden lg:block'}`}>
//               <ConversationsList
//                 conversations={conversations}
//                 activeConversationId={activeConversationId || undefined}
//                 onSelectConversation={setActiveConversationId}
//               />
//             </div>

        
//             <div className={`lg:col-span-2 flex flex-col ${!activeConversationId && 'hidden lg:flex'}`}>
//               {activeConversation ? (
//                 <>
//                   {/* Back button on mobile */}
//                   <button
//                     onClick={() => setActiveConversationId(null)}
//                     className="lg:hidden p-4 bg-white border-b border-purple-dark/10 text-left flex items-center gap-2 text-purple-dark"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                     </svg>
//                     <span>Retour</span>
//                   </button>

//                   <div className="flex-1 overflow-hidden flex flex-col">
//                     <MessageThread
//                       messages={activeConversation.messages}
//                       participant={activeConversation.participant}
//                       product={activeConversation.product}
//                     />
//                     <MessageInput onSend={handleSendMessage} />
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex-1 flex items-center justify-center bg-cream-light/20">
//                   <p className="text-black-deep/60">Sélectionnez une conversation</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//         </>
//   );
// }

// // Demo data
// const demoConversations: Conversation[] = [
//   {
//     id: '1',
//     participant: {
//       name: 'Le Collectionneur',
//       avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
//       initials: 'LC',
//     },
//     lastMessage: {
//       text: 'Oui, la pièce est toujours disponible...',
//       timestamp: '14:32',
//     },
//     unreadCount: 0,
//   },
//   {
//     id: '2',
//     participant: {
//       name: 'L\'Amateur Parisien',
//       avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
//       initials: 'AP',
//     },
//     lastMessage: {
//       text: 'Merci pour votre proposition, je vais réfléchir',
//       timestamp: 'Hier',
//     },
//     unreadCount: 0,
//   },
//   {
//     id: '3',
//     participant: {
//       name: 'Vintage Rare',
//       avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
//       initials: 'VR',
//     },
//     lastMessage: {
//       text: 'Parfait, rendez-vous confirmé',
//       timestamp: 'Mar 15',
//     },
//     unreadCount: 0,
//   },
//   {
//     id: '4',
//     participant: {
//       name: 'Élégance Discrète',
//       avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
//       initials: 'ED',
//     },
//     lastMessage: {
//       text: 'Pourriez-vous m\'envoyer plus de photos ?',
//       timestamp: 'Mar 12',
//     },
//     unreadCount: 0,
//   },
//   {
//     id: '5',
//     participant: {
//       name: 'La Modeuse',
//       avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
//       initials: 'LM',
//     },
//     lastMessage: {
//       text: 'Excellente transaction, merci !',
//       timestamp: 'Mar 10',
//     },
//     unreadCount: 0,
//   },
// ];

// const demoConversationDetails: ConversationDetail[] = [
//   {
//     id: '1',
//     participant: {
//       name: 'Le Collectionneur',
//       avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
//       initials: 'LC',
//       status: 'En ligne',
//     },
//     messages: [
//       {
//         id: '1',
//         senderId: 'other',
//         text: 'Bonjour, je suis intéressé par la pièce que vous avez mise en vente. Serait-il possible d\'avoir plus de détails sur sa provenance ?',
//         timestamp: '13:45',
//         isOwn: false,
//       },
//       {
//         id: '2',
//         senderId: 'me',
//         text: 'Bien sûr. Cette pièce provient d\'une collection privée parisienne. Elle est authentifiée et accompagnée de tous les documents nécessaires.',
//         timestamp: '13:52',
//         isOwn: true,
//       },
//       {
//         id: '3',
//         senderId: 'other',
//         text: 'Parfait. Quel serait votre meilleur prix ? Je suis un acheteur sérieux.',
//         timestamp: '14:15',
//         isOwn: false,
//       },
//       {
//         id: '4',
//         senderId: 'me',
//         text: 'Je peux vous proposer une réduction de 10% sur le prix affiché. Cela vous conviendrait-il ?',
//         timestamp: '14:25',
//         isOwn: true,
//       },
//     ],
//   },
//   {
//     id: '2',
//     participant: {
//       name: 'L\'Amateur Parisien',
//       avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
//       initials: 'AP',
//     },
//     messages: [
//       {
//         id: '1',
//         senderId: 'other',
//         text: 'Bonjour, je souhaiterais acheter cet objet. Est-il possible de le voir avant ?',
//         timestamp: 'Hier 10:00',
//         isOwn: false,
//       },
//       {
//         id: '2',
//         senderId: 'me',
//         text: 'Bonjour, oui bien sûr. Je suis disponible cette semaine si vous le souhaitez.',
//         timestamp: 'Hier 10:30',
//         isOwn: true,
//       },
//       {
//         id: '3',
//         senderId: 'other',
//         text: 'Merci pour votre proposition, je vais réfléchir',
//         timestamp: 'Hier 11:00',
//         isOwn: false,
//       },
//     ],
//   },
// ];