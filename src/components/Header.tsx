import React from 'react';
import { Scale, ShieldCheck, User as UserIcon, PlusCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNewScanClick: () => void;
  serverStatus: 'online' | 'analyzing' | 'idle';
  hasGeminiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onNewScanClick,
  serverStatus,
  hasGeminiKey,
}) => {
  return (
    <header className="bg-[#1E293B] border-b border-slate-700/50 text-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/30 text-white font-bold">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">LM-CHECK</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tracking-wide uppercase">
                BENTO METROLOGY
              </span>
            </div>
            <p className="text-xs text-slate-400">Legal Metrology Enforcement Platform</p>
          </div>
        </div>

        {/* Center status indicator */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <span
              className={`w-2 h-2 rounded-full ${
                serverStatus === 'analyzing'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-slate-300 font-medium">Rules Engine v2026.1</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
            {hasGeminiKey ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Gemini 3.8 Vision Active</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300">Dual Mode Ready</span>
              </>
            )}
          </div>
        </div>

        {/* Right actions & role switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewScanClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start New Scan</span>
          </button>

          {/* Role Pill Switcher */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/60">
            <button
              onClick={() => onRoleChange('inspector')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentRole === 'inspector'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👮 Inspector
            </button>
            <button
              onClick={() => onRoleChange('admin')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👨‍💼 Admin
            </button>
          </div>

          {/* Officer profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700/60">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold text-xs">
              {currentRole === 'inspector' ? 'JD' : 'AD'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {currentRole === 'inspector' ? 'John Doe' : 'Admin Director'}
              </p>
              <p className="text-[10px] text-slate-400">
                {currentRole === 'inspector' ? 'Field Inspector' : 'Legal Metrology HQ'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
