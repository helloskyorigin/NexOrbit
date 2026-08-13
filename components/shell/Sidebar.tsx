'use client';

import React from 'react';
import {
  Home,
  Brain,
  History,
  CheckSquare,
  Target,
  Cpu,
  Settings as SettingsIcon,
  Sparkles,
  Link2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ProUsageCard } from './ProUsageCard';
import { UserProfileDropdown } from './UserProfileDropdown';
import { CONNECTOR_DATA, ConnectorId, getConnectorIcon } from './ConnectorModal';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
  { id: 'ask-my-world', label: 'Ask My World', icon: <Brain className="h-4 w-4" /> },
  { id: 'what-changed', label: 'What Changed', icon: <History className="h-4 w-4" /> },
  { id: 'clean-my-day', label: 'Clean My Day', icon: <CheckSquare className="h-4 w-4" /> },
  { id: 'goals', label: 'Goals', icon: <Target className="h-4 w-4" /> },
  { id: 'memory', label: 'Memory', icon: <Cpu className="h-4 w-4" /> },
];

export const CONNECTORS_NAV: Array<{ id: ConnectorId; name: string }> = [
  { id: 'gmail', name: 'Gmail' },
  { id: 'calendar', name: 'Calendar' },
  { id: 'drive', name: 'Drive' },
  { id: 'notion', name: 'Notion' },
  { id: 'github', name: 'GitHub' },
];

export interface SidebarProps {
  activePage: string;
  onSelectPage: (pageId: string) => void;
  onOpenConnector: (connectorId: ConnectorId) => void;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  onOpenConnector,
  className,
}) => {
  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20',
        className
      )}
    >
      {/* Top Header & Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Brand / Logo */}
        <div
          onClick={() => onSelectPage('home')}
          className="flex items-center gap-2.5 px-2 cursor-pointer group"
        >
          <div className="h-8 w-8 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center font-bold shadow-xs group-hover:bg-slate-800 transition-colors">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              NEXORBIT
            </div>
            <div className="text-[10px] font-medium tracking-wider uppercase text-slate-400 -mt-0.5">
              AI Brain
            </div>
          </div>
        </div>

        {/* Main Navigation List */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
            Main Navigation
          </div>
          <nav className="space-y-1">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <span className={cn('shrink-0', isActive ? 'text-indigo-400' : 'text-slate-400')}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Connected Apps Section */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <button
            onClick={() => onSelectPage('connected-apps')}
            className="w-full flex items-center justify-between px-2 mb-1 group text-left cursor-pointer"
          >
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase group-hover:text-indigo-600 transition-colors">
              Connected Apps
            </span>
            <Link2 className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </button>
          <div className="space-y-0.5">
            {CONNECTORS_NAV.map((conn) => {
              const info = CONNECTOR_DATA[conn.id];
              return (
                <button
                  key={conn.id}
                  onClick={() => onOpenConnector(conn.id)}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150 group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                      {getConnectorIcon(conn.id, 'h-3.5 w-3.5')}
                    </span>
                    <span className="truncate">{info.name}</span>
                  </div>

                  {/* Small Status Indicator Dot */}
                  <span className="flex items-center gap-1 shrink-0">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        info.connected ? 'bg-emerald-500' : 'bg-slate-300'
                      )}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Pro Usage Card, Settings, User Profile */}
      <div className="p-4 border-t border-slate-100/90 space-y-3.5 bg-slate-50/50">
        <ProUsageCard used={1250} total={15000} />

        {/* Settings Navigation Item */}
        <button
          onClick={() => onSelectPage('settings')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
            activePage === 'settings'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          <SettingsIcon
            className={cn('h-4 w-4 shrink-0', activePage === 'settings' ? 'text-indigo-400' : 'text-slate-400')}
          />
          <span>Settings</span>
        </button>

        {/* User Profile */}
        <div className="pt-1 border-t border-slate-200/60">
          <UserProfileDropdown onNavigate={onSelectPage} />
        </div>
      </div>
    </aside>
  );
};
