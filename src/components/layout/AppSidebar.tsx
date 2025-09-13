import { useState } from "react"
import { 
  QrCode, 
  User, 
  GitBranch, 
  FileText, 
  Settings, 
  Home,
  Leaf
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

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
} from "@/components/ui/sidebar"

import ayurVeritasLogo from "@/assets/ayur-veritas-logo.png"

const menuItems = [
  { key: "dashboard", icon: Home, url: "/" },
  { key: "scan_product", icon: QrCode, url: "/scan" },
  { key: "my_kyc", icon: User, url: "/kyc" },
  { key: "supply_chain", icon: GitBranch, url: "/supply-chain" },
  { key: "reports", icon: FileText, url: "/reports" },
  { key: "settings", icon: Settings, url: "/settings" },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const { t } = useTranslation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-sm" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <img 
              src={ayurVeritasLogo} 
              alt="Ayur-Veritas Logo" 
              className="h-8 w-8"
            />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-sidebar-primary">Ayur</span>
              <span className="font-bold text-lg text-accent">Veritas</span>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60 font-semibold">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavCls({ isActive })}`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-sm font-medium">
                          {t(item.key)}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Verification Badge */}
        {!collapsed && (
          <div className="mt-auto p-4">
            <div className="bg-gradient-primary p-4 rounded-lg text-center">
              <Leaf className="h-6 w-6 mx-auto mb-2 text-primary-foreground" />
              <div className="text-xs text-primary-foreground font-medium">
                Blockchain Verified
              </div>
              <div className="text-xs text-primary-foreground/80 mt-1">
                Sustainability Guaranteed
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}