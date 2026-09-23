import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StreamProvider, useStream } from './context/StreamContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';

import { LandingPage } from './pages/LandingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { BrowsePage } from './pages/BrowsePage';
import { WatchPage } from './pages/WatchPage';
import { ChannelPage } from './pages/ChannelPage';
import { CreatorDashboard } from './pages/CreatorDashboard';
import { UserProfilePage } from './pages/UserProfilePage';
import { SearchPage } from './pages/SearchPage';
import { AuthPages } from './pages/AuthPages';
import { AdminDashboard } from './pages/AdminDashboard';

import { LIVE_STREAMS } from './data/mockData';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [pageParams, setPageParams] = useState({});
  const [activeStream, setActiveStream] = useState(LIVE_STREAMS[0]);

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStream = (stream) => {
    setActiveStream(stream);
    handleNavigate('watch', { streamId: stream.id });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Header (Shown on all pages except full auth) */}
      {currentPage !== 'auth' && (
        <Navbar
          onNavigate={handleNavigate}
          currentPage={currentPage}
          onOpenAuth={() => handleNavigate('auth')}
        />
      )}

      {/* Page Routing */}
      <div className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage onNavigate={handleNavigate} onSelectStream={handleSelectStream} />
        )}
        {currentPage === 'discover' && (
          <DiscoverPage onNavigate={handleNavigate} onSelectStream={handleSelectStream} />
        )}
        {currentPage === 'browse' && (
          <BrowsePage
            onNavigate={handleNavigate}
            onSelectStream={handleSelectStream}
            categorySlug={pageParams.categorySlug}
          />
        )}
        {currentPage === 'watch' && (
          <WatchPage onNavigate={handleNavigate} stream={activeStream} />
        )}
        {currentPage === 'channel' && (
          <ChannelPage
            onNavigate={handleNavigate}
            onSelectStream={handleSelectStream}
            username={pageParams.username || 'NeonVortex'}
          />
        )}
        {currentPage === 'dashboard' && (
          <CreatorDashboard onNavigate={handleNavigate} />
        )}
        {currentPage === 'profile' && (
          <UserProfilePage onNavigate={handleNavigate} initialModal={pageParams.modal} />
        )}
        {currentPage === 'search' && (
          <SearchPage
            onNavigate={handleNavigate}
            onSelectStream={handleSelectStream}
            query={pageParams.q}
          />
        )}
        {currentPage === 'auth' && (
          <AuthPages onNavigate={handleNavigate} />
        )}
        {currentPage === 'admin' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StreamProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </StreamProvider>
    </AuthProvider>
  );
}
