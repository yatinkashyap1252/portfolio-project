"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Info,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Image,
  History,
  Settings,
  Mail,
} from "lucide-react";

interface SidebarProps {
  onLinkClick?: () => void;
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Hero Section", href: "/dashboard/hero", icon: User },
    { name: "About Section", href: "/dashboard/about", icon: Info },
    { name: "Technical Skills", href: "/dashboard/skills", icon: Code2 },
    { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
    { name: "Experience", href: "/dashboard/experience", icon: Briefcase },
    { name: "Education", href: "/dashboard/education", icon: GraduationCap },
    { name: "Certificates", href: "/dashboard/certificates", icon: Award },
    { name: "Contact Info", href: "/dashboard/contact", icon: Mail },
    { name: "SEO Management", href: "/dashboard/seo", icon: Globe },
    { name: "Media Library", href: "/dashboard/media", icon: Image },
    { name: "Activity Logs", href: "/dashboard/logs", icon: History },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[#E63925] flex items-center justify-center text-white font-mono font-bold text-xs select-none">
            C
          </div>
          <span className="font-sans font-bold tracking-tight text-white uppercase text-sm select-none">
            Portfolio CMS
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-colors group cursor-pointer
                ${
                  isActive
                    ? "bg-[#E63925]/10 text-[#E63925] border-l-2 border-[#E63925] rounded-l-none"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }
              `}
            >
              <item.icon
                className={`h-4 w-4 shrink-0 transition-colors
                  ${isActive ? "text-[#E63925]" : "text-zinc-500 group-hover:text-zinc-300"}
                `}
              />
              <span className="uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Info Footer */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/30">
        <div className="flex items-center justify-between font-mono text-[9px] text-zinc-600">
          <span>VERSION 1.0.0</span>
          <span>ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
