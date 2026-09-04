import React from 'react';
import {
  LayoutDashboard,
  Camera,
  History,
  Package,
  BookOpen,
  BarChart3,
  Scale,
  Shield,
  FileText,
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'new-scan'
  | 'history'
  | 'products'
  | 'rules'
  | 'analytics';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabSelect: (tab: ActiveTab) => void;
  currentRole: UserRole;
  pendingReviewsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabSelect,
  currentRole,
  pendingReviewsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'new-scan' as ActiveTab,
      label: 'New Inspection',
      icon: Camera,
      badge: 'Scan',
    },
    {
      id: 'history' as ActiveTab,
      label: 'Inspection History',
      icon: History,
      badge: null,
    },
    {
      id: 'products' as ActiveTab,
      label: 'Product Repository',
      icon: Package,
      badge: null,
    },
    {
      id: 'rules' as ActiveTab,
      label: 'Rule Database',
      icon: BookOpen,
      badge: 'Pkg Rules',
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Analytics & Trends',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-[#1E293B] border-r border-slate-700/50 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Bar in Sidebar */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-700/50">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-500/30 font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-white font-bold tracking-tight text-base block">LM-CHECK</span>
            <span className="text-[10px] text-indigo-300 font-medium tracking-wide block uppercase">
              Bento Metrology
            </span>
          </div>
        </div>

        {/* Role identification card */}
        <div className="p-4">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Active Role
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                {currentRole === 'admin' ? 'Directorate Admin' : 'Field Inspector'}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  currentRole === 'admin'
                    ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                    : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                }`}
              >
                {currentRole === 'admin' ? 'ADMIN' : 'INSPECTOR'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 space-y-1.5 text-slate-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabSelect(item.id)}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-slate-700/50 text-white font-semibold shadow-xs ring-1 ring-white/10'
                    : 'text-slate-300 hover:bg-slate-700/30 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.id === 'history' && pendingReviewsCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {pendingReviewsCount} rev
                  </span>
                )}
                {item.badge && item.id !== 'history' && (
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/80'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Badge */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40">
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold text-xs">
            {currentRole === 'admin' ? 'AD' : 'JD'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs text-white font-semibold truncate">
              {currentRole === 'admin' ? 'Admin Director' : 'John Doe'}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {currentRole === 'admin' ? 'Legal Metrology HQ' : 'Field Inspector • DL-09'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
