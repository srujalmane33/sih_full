import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);
  const openModal = useCallback((modalId) => setActiveModal(modalId), []);
  const closeModal = useCallback(() => setActiveModal(null), []);
  const toggleDrawer = useCallback(() => setDrawerOpen((p) => !p), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const contextValue = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      activeModal,
      openModal,
      closeModal,
      drawerOpen,
      toggleDrawer,
      closeDrawer,
      activePage,
      setActivePage,
    }),
    [sidebarOpen, activeModal, drawerOpen, activePage, toggleSidebar, openModal, closeModal, toggleDrawer, closeDrawer]
  );

  return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>;
}

export function useUIContext() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return ctx;
}
