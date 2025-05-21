import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "@/context/userContext";
import { logoutSession } from "@/api/authApi";
import {
  Home,
  Gavel,
  Users,
  BarChart2,
  MessageCircle,
  Settings as SettingsIcon,
  Menu,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import "./style.scss";

const sidebarVariants = {
  open: {
    width: 300,
    transition: { type: "spring", stiffness: 200, damping: 30 },
  },
  closed: {
    width: 64,
    transition: { type: "spring", stiffness: 200, damping: 30 },
  },
};

const labelVariants = {
  open: {
    opacity: 1,
    x: 0,
    width: "auto",
    transition: { duration: 0.2 },
  },
  closed: {
    opacity: 0,
    x: -20,
    width: 0,
    transition: { duration: 0.2 },
  },
};

const SidebarAdmin = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { logout , userData } = useAuth();
  const username = userData?.username  || "المستخدم";

  const navItems = [
    { to: "/", label: "الرئيسية", icon: <Home /> },
    { to: "/cases", label: "منظومة قضايا الاعضاء", icon: <Gavel />, isDropdown: true },
    { to: "/reports", label: "التقارير", icon: <BarChart2 /> },
    { to: "/settings", label: "الإعدادات", icon: <SettingsIcon /> },
  ];

  return (
    <motion.div
      className="sidebar bg-primary-800 text-white flex flex-col relative  overflow-hidden"
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      initial="open"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-primary-700">
        <div className="flex items-center gap-2">
          {
            !isOpen ? (
              <button
                onClick={() => setIsOpen(!isOpen)}>
                <Home className="text-2xl text-primary-300" />
              </button>
            ) : (
              <Home className="text-2xl text-primary-300" />
            )
          }          <AnimatePresence>
            {isOpen && (
              <motion.span
                className="sidebar-text mr-2 text-xl font-bold overflow-hidden whitespace-nowrap"
                variants={labelVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                  منظومة قضايا الاعضاء
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {
          isOpen && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-200 hover:text-white focus:outline-none"
            >
              <Menu />
            </button>
          )
        }

      </div>

      {/* User Info */}
      <div className="  p-3 border-b border-primary-700">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Users className="text-primary-200" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="mr-3 overflow-hidden"
                variants={labelVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="font-medium">{username}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {navItems.map(({ to, label, icon, isDropdown }) => (
          <div key={label} className="p-2">
            {isDropdown ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    className={`flex items-center w-full p-2 gap-2 rounded-lg transition-colors ${window.location.pathname.startsWith(to)
                      ? "text-white bg-primary-700"
                      : "text-primary-200 hover:text-white hover:bg-primary-700"
                      }`}
                  >
                    <div className="flex-shrink-0">{icon}</div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          className="mr-3 overflow-hidden whitespace-nowrap"
                          variants={labelVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right">
                  <DropdownMenuItem>
                    <Link to="/case/members"> قضايا الأعضاء</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to={to}
                className={`flex items-center p-2 gap-2 rounded-lg transition-colors ${window.location.pathname === to
                  ? "text-white bg-primary-700"
                  : "text-primary-200 hover:text-white hover:bg-primary-700"
                  }`}
              >
                <div className="flex-shrink-0">{icon}</div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      className="mr-3 overflow-hidden whitespace-nowrap"
                      variants={labelVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}
          </div>
        ))}
        
      </nav>

      {/* Footer / Logout */}
      <div className="p-4  border-primary-700  relative z-40">
        <button
          onClick={async () => {
            await logoutSession();
            logout();
          }}
          className="flex items-center w-full gap-2 text-primary-200 hover:text-white focus:outline-none"
        >
          <LogOut className="flex-shrink-0" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                className="mr-3 overflow-hidden whitespace-nowrap"
                variants={labelVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                تسجيل الخروج
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[10px]">
      <div className='wave -one'></div>
      <div className='wave -two'></div>
      <div className='wave -three'></div>
      </div>
    </motion.div>
  );
};

export default SidebarAdmin;
