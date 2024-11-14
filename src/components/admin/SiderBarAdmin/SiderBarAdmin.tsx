import { Backpack, Home, User, Search, Settings, IdCard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link,Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {useUser} from "@/context/userContext"
import {Img} from 'react-image'
import {logoutSession} from '@/api/authApi'


// Menu items.
const items = [
  {
    title: "الصفحة الرئيسية",
    url: "/",
    icon: Home,
  },
  {
    title: "تجديد المتهمين",
    url: "/case/public/home",
    icon: Search,
  },
  {
    title: "قضايا العضو",
    url: "/case/private/home",
    icon: IdCard,
  },
  {
    title: "قائمة المستخدمين",
    url: "/dashboard/users",
    icon: User,
  },
  {
    title: "ادارة النسخ الاحتياطية",
    url: "/dashboard/backups",
    icon: Backpack,
  },
  {
    title: "اعدادات",
    url: "/settings",
    icon: Settings,
  },
];

const SiderBarAdmin = () => {

  const {logout} = useUser();

  const username = Cookies.get('username');

  return (
    <Sidebar className="row-span-2">
      <SidebarContent>
        <Img src="/logo.png" alt="logo" className="w-[200px] h-[100px] mx-auto" />
        <SidebarGroup>
          <SidebarGroupLabel>قائمة الادارة</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-[70px]">
                  <Avatar>
                    <AvatarImage src="/user-circle.svg" />
                    <AvatarFallback>admin</AvatarFallback>
                  </Avatar>
                  {username}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={()=>{
                  logout();
                }}>
                  <Link to="/dashboard/profile">الملف الشخصي</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async()=>{
                  await logoutSession();
                  logout();
                }}>
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SiderBarAdmin;
