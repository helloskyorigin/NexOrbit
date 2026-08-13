'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { ConnectorModal, ConnectorId } from './ConnectorModal';
import { PlaceholderPage, PAGE_CONFIG } from './PlaceholderPage';
import { HomeDashboard } from '../home/HomeDashboard';
import { Drawer } from '../ui/Drawer';
import { Terminal, Palette, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface AppShellProps {
  initialPage?: string;
  children?: React.ReactNode;
  showDevTabOption?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  initialPage = 'home',
  children,
  showDevTabOption = true,
}) => {
  const [activePage, setActivePage] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashPage = window.location.hash.replace('#', '');
      if (PAGE_CONFIG[hashPage]) {
        return hashPage;
      }
    }
    return initialPage;
  });
  const [activeConnectorId, setActiveConnectorId] = useState<ConnectorId | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleSelectPage = (pageId: string) => {
    setActivePage(pageId);
    if (typeof window !== 'undefined') {
      window.location.hash = pageId;
    }
  };

  const currentPageMeta = PAGE_CONFIG[activePage] || PAGE_CONFIG['home'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <div className="flex flex-1 w-full relative">
        {/* Persistent Fixed Left Sidebar for Desktop (lg+) */}
        <Sidebar
          activePage={activePage}
          onSelectPage={handleSelectPage}
          onOpenConnector={(id) => setActiveConnectorId(id)}
          className="hidden lg:flex"
        />

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-8">
          {/* Reusable Top Header Bar */}
          <TopBar
            activePageTitle={currentPageMeta.title}
            activePageIcon={currentPageMeta.icon}
            onNavigate={handleSelectPage}
            onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          />

          {/* Developer / Design System Quick Switcher Bar (Preserving Phase 0 & Tokens accessibility) */}
          {showDevTabOption && (
            <div className="bg-slate-100/80 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="indigo" size="sm">
                  Phase 1 App Shell
                </Badge>
                <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                  Navigating: <code className="font-mono text-indigo-700 font-semibold">/{activePage}</code>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {activePage !== 'dev-showcase' && (
                  <button
                    onClick={() => handleSelectPage('dev-showcase')}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Palette className="h-3.5 w-3.5" />
                    <span>View UI Tokens &amp; Backend Verification</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Main Content Area Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children ? (
              children
            ) : activePage === 'home' ? (
              <HomeDashboard
                onNavigate={handleSelectPage}
                onOpenConnector={(id) => setActiveConnectorId(id)}
              />
            ) : (
              <PlaceholderPage pageId={activePage} onNavigate={handleSelectPage} />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Sticky Navigation (sm & md) */}
      <MobileNav
        activePage={activePage}
        onSelectPage={handleSelectPage}
        onOpenConnector={(id) => setActiveConnectorId(id)}
      />

      {/* Mobile Header Drawer Menu */}
      <Drawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="NEXORBIT Navigation"
        subtitle="App Shell Menu"
      >
        <div className="space-y-4">
          <Sidebar
            activePage={activePage}
            onSelectPage={(pageId) => {
              setIsMobileDrawerOpen(false);
              handleSelectPage(pageId);
            }}
            onOpenConnector={(id) => {
              setIsMobileDrawerOpen(false);
              setActiveConnectorId(id);
            }}
            className="w-full border-none shadow-none h-auto"
          />
        </div>
      </Drawer>

      {/* Connector Details Modal */}
      <ConnectorModal
        connectorId={activeConnectorId}
        onClose={() => setActiveConnectorId(null)}
      />
    </div>
  );
};
