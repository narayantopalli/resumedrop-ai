"use client";

import { useState } from "react";
import { FiMenu, FiX, FiUser, FiSettings, FiLogOut, FiUpload, FiHome, FiEdit3 } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import Avatar from "@/components/Avatar";
import Link from "next/link";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { signOut, userMetadata, avatarUrl } = useSession();

  // Conditional menu items based on session
  const menuItems = userMetadata ? [
    {
      id: "home",
      label: "Home",
      icon: FiHome,
      path: "/home",
      action: "navigate",
    },
    {
      id: "upload",
      label: "Upload",
      icon: FiUpload,
      path: "/upload",
      action: "navigate",
    },
    {
      id: "settings",
      label: "Settings",
      icon: FiSettings,
      path: "/settings",
      action: "navigate",
    },
    {
      id: "logout",
      label: "Logout",
      icon: FiLogOut,
      path: "",
      action: "logout",
    },
  ] : [
    {
      id: "home",
      label: "Home",
      icon: FiHome,
      path: "/home",
      action: "navigate",
    },
    {
      id: "upload",
      label: "Upload",
      icon: FiUpload,
      path: "/upload",
      action: "navigate",
    }
  ];

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = async (item: any) => {
    setIsOpen(false);
    
    if (item.action === "logout") {
      try {
        await signOut();
        router.push("/sign-in");
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else {
      router.push(item.path);
    }
  };

  const userProfile = userMetadata ? (
    <div className="flex items-center">
      
      {avatarUrl && (userMetadata?.contactInfo?.linkedin || userMetadata?.contactInfo?.github || userMetadata?.contactInfo?.instagram || userMetadata?.contactInfo?.twitter || userMetadata?.contactInfo?.phone) ? (<>
        <Avatar
          src={avatarUrl}
          name={userMetadata?.name}
          size="sm"
        />
        <div className="hidden sm:block ml-3 mr-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {userMetadata?.name || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {userMetadata?.college}
          </p>
        </div>
      </>) : (
        <button
          onClick={() => router.push('/settings')}
          className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors font-medium text-sm border border-orange-200 dark:border-orange-700"
        >
          <FiEdit3 className="w-4 h-4" />
          <span className="sm:inline">Set Up Profile</span>
        </button>
      )}
    </div>
  ) : (
    <div className="flex items-center">
        <Link 
          href="/sign-in"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Sign In
        </Link>
    </div>
  );

  return (
    <div className="relative flex items-center">
      {/* User Profile Section */}
      {userProfile}

      {/* Hamburger Button */}
      <button
        onClick={handleMenuToggle}
        className="ml-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMenu className="w-6 h-6" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full mt-2 right-0 sm:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = item.action === "navigate" ? pathname === item.path : false;
                const isLogout = item.action === "logout";
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isLogout
                        ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        : active
                        ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 