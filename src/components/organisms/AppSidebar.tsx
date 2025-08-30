import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  Wallet2,
  User,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import useHasAdminPermission from "@/hooks/use-has-admin-permission";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { deleteSharedCookie } from "@/utils/cookie";
import { ACCESS_TOKEN_NAME } from "@/constants";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, restricted: false },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    restricted: false,
  },
  { title: "Settings", url: "/settings", icon: Settings, restricted: true },
  { title: "Users", url: "/users", icon: Settings, restricted: true },
  { title: "Deposits", url: "/deposits", icon: Wallet2, restricted: true },
];

const LogoutDialog = () => {
  const logout = () => {
    deleteSharedCookie(ACCESS_TOKEN_NAME);

    window.location.href = "/";
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button className=" w-full" variant="outline">
          Logout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>Are you sure you want to logout?</DialogDescription>
        <DialogFooter>
          <Button variant="destructive" onClick={logout}>
            Yes
          </Button>
          <Button variant="ghost">
            <DialogClose> No</DialogClose>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const hasAdminPermission = useHasAdminPermission();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary text-primary-foreground font-medium"
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-"} collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-2 p-4">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold">Your Account</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems
                .filter((item) => hasAdminPermission || !item.restricted)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavCls}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <LogoutDialog />
      </SidebarFooter>
    </Sidebar>
  );
}
