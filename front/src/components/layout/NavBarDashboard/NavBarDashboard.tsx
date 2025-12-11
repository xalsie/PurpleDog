"use client";

import Link from "next/link";
import { FaRegHeart , FaRegClock } from "react-icons/fa";
import Notificationlink from "@/components/ui/NotificationLink/NotificationLink";
import Avatar from "@/components/ui/Avatar/Avatar";
import { UserRole } from "@/types/index";

interface INavBarDashboard {
  UserType: UserRole | undefined;
  logOut : () => void
}

export default function NavBarDashboard({ UserType,logOut }: INavBarDashboard) {

    const notifications = ["e", "e"];

    return (
        <header className="sticky top-0 z-50 w-full bg-WhiteC text-VioletC border-b border-BeigeC border">
        <div className="w-full mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex-1 md:text-center">
            <Link
                href="#"
                className="text-xl font-regular tracking-wide md:text-3xl font-gamora"
            >
                Purple Dog
            </Link>
            </div>
            
            <div className="flex flex-row items-center gap-2 md:gap-4 md:justify-end">
            {UserType === UserRole.PROFESSIONAL && (
                <>
                <Link href="/Favorites">
                    <FaRegHeart className="text-xl hover:opacity-70 transition md:w-6 md:h-6" />
                </Link>

                <Link href="#">
                    <FaRegClock className="text-xl hover:opacity-70 transition md:w-6 md:h-6" />
                </Link>
                </>
            )}

            <Notificationlink Notification={notifications} />
            <Avatar name="elias" onLogout={logOut} />
            </div>

        </div>
        </header>
    );
}
