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
import {useAuth} from "@/context/userContext"
import {Img} from 'react-image'
import {logoutSession} from '@/api/authApi'
import { navBarAdminItem } from "@/data/navBarAdmin";


// Menu items.


const SiderBarAdmin = () => {

  const {logout} = useAuth();

  const username = Cookies.get('username');

  return (
    <Sidebar className=" row-span-1 bg-red-600  " style={{ width: "250px"}}>
      <SidebarContent>
        <Img src="/logo.png" alt="logo" className="w-[200px] h-[100px] mx-auto" />
        <SidebarGroup>
          <SidebarGroupLabel>قائمة الادارة</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navBarAdminItem.map((item,index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link to={item.linkTo || "/"}>
                      <span>{item.name}</span>
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
