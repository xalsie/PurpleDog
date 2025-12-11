"use client";

import Link from "next/link";
import { IoMailOutline } from "react-icons/io5";
import { useState } from "react";

interface INotificationLink {
  Notification?  : string[]
}

export default function NotificationLink({ Notification = []} : INotificationLink) {
  const [notifNumber, setNotifNumber] = useState<number>(Notification.length)

  return (
    <div className="relative w-fit">
      <Link href="/" className="text-VioletC hover:opacity-80 transition">
        <IoMailOutline className="w-7 h-7 md:w-8 md:h-8" />
      </Link>

      {notifNumber > 0 && (
        <span
          className="absolute -top-1 -right-1  bg-VioletC text-WhiteC text-xs font-regular w-4 h-4 flex items-center justify-center rounded-full md:w-5 md:h-5 md:text-sm"
        >
          {notifNumber}
        </span>
      )}
    </div>
  );
}

