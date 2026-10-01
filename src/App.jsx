import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StreamProvider, useStream } from './context/StreamContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { AuthModal } from './components/common/AuthModal';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { LandingPage } from './pages/LandingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { BrowsePage } from './pages/BrowsePage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { FollowingPage } from './pages/FollowingPage';
import { WatchPage } from './pages/WatchPage';
import { ChannelPage } from './pages/ChannelPage';
import { CreatorDashboard } from './pages/CreatorDashboard';
import { UserProfilePage } from './pages/UserProfilePage';
import { UserDashboard } from './pages/UserDashboard';
import { SearchPage } from './pages/SearchPage';
import { AuthPages } from './pages/AuthPages';
import { AdminDashboard } from './pages/AdminDashboard';

import { LIVE_STREAMS } from './data/mockData';

function AppContent() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [currentPage, setCurrentPage] = useState('discover');
  const [pageParams, setPageParams] = useState({});
  const [activeStream, setActiveStream] = useState(null);

  const handleNavigate = (page, params = {}) => {
    const protectedPages = ['dashboard', 'user-dashboard', 'profile'];
    if (protectedPages.includes(page) && (!user?.onboardingCompleted || !isAuthenticated)) {
      openAuthModal();
      return;
    }
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStream = (stream) => {
    setActiveStream(stream);
    handleNavigate('watch', { streamId: stream?.id });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-16 md:pb-0">
      {/* Navbar Header */}
      {currentPage !== 'auth' && (
        <Navbar
          onNavigate={handleNavigate}
          currentPage={currentPage}
          onOpenAuth={openAuthModal}
        />
      )}

      {/* Main Page Router wrapped in ErrorBoundary */}
      <div className="flex-1">
        <ErrorBoundary>
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
          {currentPage === 'category' && (
            <CategoryDetailPage
              onNavigate={handleNavigate}
              onSelectStream={handleSelectStream}
              categorySlug={pageParams.categorySlug}
            />
          )}
          {currentPage === 'following' && (
            <FollowingPage onNavigate={handleNavigate} onSelectStream={handleSelectStream} />
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
            <CreatorDashboard onNavigate={handleNavigate} autoStartCamera={pageParams.autoStartCamera} />
          )}
          {currentPage === 'user-dashboard' && (
            <UserDashboard onNavigate={handleNavigate} initialTab={pageParams.tab || 'overview'} />
          )}
          {currentPage === 'profile' && (
            <UserDashboard onNavigate={handleNavigate} initialTab={pageParams.tab || 'overview'} />
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
        </ErrorBoundary>
      </div>

      {/* Mobile Phone App Navigation Bar */}
      {currentPage !== 'auth' && (
        <MobileBottomNav onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      {/* Interactive Account Auth & Follow Creator Modal */}
      <AuthModal />

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StreamProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </StreamProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
