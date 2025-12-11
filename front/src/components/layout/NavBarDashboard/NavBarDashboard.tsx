"use client"

import Link from "next/link";
import { FaHeart, FaRegClock  } from "react-icons/fa";
import Notificationlink from "@/components/ui/NotificationLink/NotificationLink";
import Avatar from "@/components/ui/Avatar/Avatar";
import Person from "../../../public/photo-test.jpg"

interface INavBarDashboard {
    UserType : "Seller" | "Professional" | "Admin";
}

export default function NavBarDashboard({UserType} : INavBarDashboard) {

    const notifications = ["e","e"];

    const LogOut = () => {
        console.log('déconnexion')
    }

  return (
    <header className="w-full bg-WhiteC text-VioletC border-b border-BeigeC border">
        <div className="w-full mx-auto px-4 py-4 flex flex-row items-center justify-between gap-4">
            <Link   
                href="#"
                className="text-xl font-semibold tracking-wide md:text-2xl"
            >
                Purple Dog
            </Link>

            <div className="flex flex-row items-center gap-2 md:gap-4">
                { UserType === "Professional" && 
                    <>
                        <Link href="#">
                        <FaHeart className="text-xl hover:opacity-70 transition md:w-6 md:h-6" />
                        </Link>
                        <Link href="#">
                            <FaRegClock className="text-xl hover:opacity-70 transition md:w-6 md:h-6" />
                        </Link>
                        
                        
                    </>
                }
              <Notificationlink Notification={notifications} />
              <Avatar name="elias" onLogout={LogOut} photoUrl={Person}/>
            </div>
        </div>
    </header>
  )
}
