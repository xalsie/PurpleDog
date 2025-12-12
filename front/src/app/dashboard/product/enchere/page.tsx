'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import {
    AuctionHeader,
    AuctionDetails,
    PhotoGallery,
    SellerInfos,
} from '@/components/sections/Index';
import NavBarDashboard from '@/components/layout/NavBarDashboard/NavBarDashboard';
import { useAuth } from '@/hooks/useAuth';
import axiosInstance from '@/lib/axios';
import { io, Socket } from 'socket.io-client';

interface AuctionData {
    id: string;
    item: {
        id: string;
        name: string;
        description: string;
        brand: string;
        model: string;
        material: string;
        color: string;
        year: string;
        condition: string;
        authenticated: boolean;
        medias: { url: string; isPrimary: boolean }[];
        seller: {
            id: string;
            name: string;
            avatar: string;
            verified: boolean;
        };
    };
    startTime: string;
    endTime: string;
    currentPrice: number;
    bids: any[];
    status: 'PENDING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
}

export default function AuctionProductPage() {
    const [auction, setAuction] = useState<AuctionData | null>(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [bidAmount, setBidAmount] = useState(0);
    const [maxBidAmount, setMaxBidAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, logout } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);

    const calculateTimeLeft = useCallback(() => {
        if (!auction) return;

        const now = new Date().getTime();
        const endTime = new Date(auction.endTime).getTime();
        const distance = endTime - now;

        if (distance < 0) {
            setTimeLeft('Terminée');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${days}j ${hours}h ${minutes}m ${seconds}s`);
    }, [auction]);

    useEffect(() => {
        const itemId = searchParams.get('id');
        if (!itemId) {
            router.push('/dashboard');
            return;
        }

        const fetchAuction = async () => {
            try {
                const { data } = await axiosInstance.get(`/auctions/item/${itemId}`);
                if (data) {
                    setAuction(data);
                    const nextBid = data.currentPrice + getBidIncrement(data.currentPrice);
                    setBidAmount(nextBid);
                    setMaxBidAmount(nextBid);
                    
                    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
                    setSocket(newSocket);

                    newSocket.on('connect', () => {
                        newSocket.emit('joinAuction', data.id);
                    });

                    newSocket.on('auctionUpdate', (updatedAuction: AuctionData) => {
                        setAuction(updatedAuction);
                    });
                }
            } catch (err) {
                setError('Failed to load auction data.');
            } finally {
                setLoading(false);
            }
        };

        fetchAuction();

        return () => {
            if(socket) {
                socket.off('connect');
                socket.off('auctionUpdate');
                socket.disconnect();
            }
        };
    }, [searchParams, router]);

    useEffect(() => {
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    const getBidIncrement = (price: number): number => {
        if (price < 100) return 10;
        if (price < 500) return 50;
        if (price < 1000) return 100;
        if (price < 5000) return 200;
        return 500;
    };

    const handleBid = async (amount: number, maxAmount?: number) => {
        if (!auction) return;
        try {
            await axiosInstance.post('/bids', {
                auctionId: auction.id,
                amount: amount,
                maxAmount: maxAmount,
            });
        } catch (err: any) {
             setError(err.response?.data?.message ||'Failed to place bid.');
        }
    };
    
    const quickBidOptions = () => {
        if (!auction) return [];
        const increment = getBidIncrement(auction.currentPrice);
        const nextBid = auction.currentPrice + increment;
        return [nextBid, nextBid + increment, nextBid + 2 * increment];
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;
    if (!auction) return (
        <div className="text-center mt-10">
            <p>Aucune enchère n'a été trouvée pour cet article.</p>
            {/* TODO: Add a button here to create an auction */}
        </div>
    );


    const { item } = auction;
    const images = (item.medias ?? []).map((m) => `${process.env.NEXT_PUBLIC_API_URL}${m.url}`);

    return (
        <>
            <NavBarDashboard UserType={user?.role} logOut={logout} />
            <main className="pt-16 sm:pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                        <section className="order-1">
                            <PhotoGallery images={images} title={item.name} status={auction.status} />
                        </section>
                        <section className="order-2">
                            <div className="sticky top-24">
                                <AuctionHeader
                                    brand={item.brand}
                                    title={item.name}
                                    subtitle={item.description.substring(0, 50) + '...'}
                                    currentBid={auction.currentPrice}
                                    timeLeft={timeLeft}
                                    bidsCount={auction.bids.length}
                                    onBid={() => handleBid(bidAmount)}
                                    onLike={() => {}}
                                    onMessage={() => {}}
                                />
                                {auction.status === 'ACTIVE' && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-medium text-gray-900">Placer une enchère</h3>
                                        <div className="mt-2 flex gap-2">
                                            {quickBidOptions().map(amount => (
                                                <Button key={amount} onClick={() => handleBid(amount)}>
                                                    {amount} €
                                                </Button>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            <input
                                                type="number"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(Number(e.target.value))}
                                                className="border-gray-300 rounded-md shadow-sm"
                                            />
                                            <Button onClick={() => handleBid(bidAmount)} className="ml-2">
                                                Enchérir
                                            </Button>
                                        </div>
                                        <div className="mt-4">
                                            <label>Enchère automatique (max):</label>
                                            <input
                                                type="number"
                                                value={maxBidAmount}
                                                onChange={(e) => setMaxBidAmount(Number(e.target.value))}
                                                placeholder="Votre enchère maximale"
                                                className="border-gray-300 rounded-md shadow-sm"
                                            />
                                            <Button
                                                onClick={() => handleBid(bidAmount, maxBidAmount)}
                                                className="ml-2"
                                            >
                                                Placer
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <SellerInfos
                                    seller={item.seller}
                                    onContact={() => {}}
                                />
                                <AuctionDetails
                                    brand={item.brand}
                                    model={item.model}
                                    material={item.material}
                                    color={item.color}
                                    year={item.year}
                                    condition={item.condition}
                                    authenticated={item.authenticated}
                                    description={item.description}
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}
