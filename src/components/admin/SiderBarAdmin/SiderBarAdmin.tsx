import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/userContext";
import { logoutSession } from "@/api/authApi";
import {
  Home,
  Gavel,
  BarChart2,
  Settings as SettingsIcon,
  Menu,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import "./style.scss";

const NavbarAdmin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, userData } = useAuth();
  const username = userData?.username || "المستخدم";

  type NavItem = {
    to: string;
    label: string;
    icon: React.ReactNode;
    subItems?: { to: string; label: string }[];
  };

  const navItems: NavItem[] = [
    { 
      to: "/case/members", 
      label: "قضايا الاعضاء", 
      icon: <Gavel />, 
      // subItems: [ { to: "/case/members/sub", label: "فرعي" } ], // Uncomment and edit if you want subItems
    },
    { to: "/", label: "الرئيسية", icon: <Home /> },


  ];

  return (
    <motion.nav 
      className="  navbar fixed top-0  w-full bg-primary-800 text-white shadow-lg z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* الشعار وزر القائمة */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-primary-700 p-2 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm">{username.charAt(0)}</span>
                </div>
                <span className="hidden md:block">{username}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-primary-800 text-white border-primary-700">
                <DropdownMenuItem 
                  className="hover:bg-primary-700"
                  onClick={async () => {
                    await logoutSession();
                    logout();
                  }}
                >
                  <LogOut className="mr-2" size={16} />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* زر القائمة للجوال */}
            <button
              className="md:hidden p-2 hover:bg-primary-700 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu />
            </button>
          </div>

          {/* عناصر التنقل لسطح المكتب */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.subItems ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 hover:bg-primary-700 rounded-lg transition-colors">
                      {item.icon}
                      <span>{item.label}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-primary-800 text-white border-primary-700">
                      {item.subItems.map((subItem) => (
                        <DropdownMenuItem key={subItem.label} className="hover:bg-primary-700">
                          <Link to={subItem.to} className="w-full px-4 py-2">
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to={item.to}
                    className="flex items-center gap-1 px-4 py-2 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* الجزء الأيمن (المستخدم وتسجيل الخروج) */}

          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold hidden md:block">
                منظومة قضايا الاعضاء
              </span>
            </Link>
          </div>
          
        </div>

        {/* قائمة الجوال */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-primary-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {navItems.map((item) => (
                <div key={item.label} className="px-4 py-2 border-t border-primary-700">
                  {item.subItems ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full flex items-center gap-2 px-4 py-2 hover:bg-primary-700 rounded-lg">
                        {item.icon}
                        <span>{item.label}</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-primary-800 text-white border-primary-700">
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.label} className="hover:bg-primary-700">
                            <Link to={subItem.to} className="w-full px-4 py-2">
                              {subItem.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      to={item.to}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-primary-700 rounded-lg"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default NavbarAdmin;