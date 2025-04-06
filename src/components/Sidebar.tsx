
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Clock, 
  Calendar, 
  Briefcase, 
  FileText,
  Menu, 
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { 
    icon: Home, 
    label: "儀表板", 
    path: "/dashboard" 
  },
  { 
    icon: Clock, 
    label: "上下班打卡", 
    path: "/clock" 
  },
  { 
    icon: FileText, 
    label: "請假申請", 
    path: "/leave" 
  },
  { 
    icon: Briefcase, 
    label: "公出/出差", 
    path: "/business-trip" 
  },
  { 
    icon: Calendar, 
    label: "出勤日曆", 
    path: "/calendar" 
  }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div 
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {!collapsed && (
          <h1 className="text-xl font-bold text-sidebar-foreground">出勤系統</h1>
        )}
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <Separator />

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                location.pathname === item.path && "bg-sidebar-accent font-medium"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-sm">
          {!collapsed && (
            <>
              <div className="w-8 h-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-800 font-bold">
                王
              </div>
              <div>
                <p className="font-medium">王小明</p>
                <p className="text-xs text-muted-foreground">員工</p>
              </div>
            </>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-800 font-bold mx-auto">
              王
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
