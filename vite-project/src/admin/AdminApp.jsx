// Force HMR trigger for new routes
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { initializeStore } from '../utils/adminStore';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import CategoriesAdmin from './pages/CategoriesAdmin';
import AddCategory from './pages/AddCategory';
import CollectionsAdmin from './pages/CollectionsAdmin';
import AddCollection from './pages/AddCollection';
import CollectionTagsAdmin from './pages/CollectionTagsAdmin';
import AddCollectionTag from './pages/AddCollectionTag';
import SupportAdmin from './pages/SupportAdmin';
import UsersAdmin from './pages/UsersAdmin';
import Settings from './pages/Settings';
import BoutiquesAdmin from './pages/BoutiquesAdmin';
import AddBoutique from './pages/AddBoutique';

export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const getInitialAdminPage = () => {
    const path = window.location.pathname;
    if (path.startsWith('/admin/')) {
      const page = path.replace('/admin/', '');
      return page || 'dashboard';
    }
    return 'dashboard';
  };

  const [activePage, setActivePage] = useState(getInitialAdminPage());

  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(getInitialAdminPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const initAdmin = async () => {
      await initializeStore();
      setStoreReady(true);
      
      if (!auth) {
        setAuthLoading(false);
        return;
      }
      onAuthStateChanged(auth, (user) => {
        setIsLoggedIn(!!user);
        setAuthLoading(false);
      });
    };
    initAdmin();
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setIsLoggedIn(false);
  };

  if (authLoading || !storeReady) {
    return <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">Loading Admin...</div>;
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <Dashboard setActivePage={setActivePage} />;
      case 'products':     return <Products setActivePage={setActivePage} />;
      case 'add-product':  return <AddProduct setActivePage={setActivePage} />;
      case 'orders':       return <Orders />;
      case 'support':      return <SupportAdmin />;
      case 'users':        return <UsersAdmin />;
      case 'collections':  return <CollectionsAdmin setActivePage={setActivePage} />;
      case 'add-collection':
      case 'edit-collection':return <AddCollection setActivePage={setActivePage} />;
      case 'collection-tags': return <CollectionTagsAdmin setActivePage={setActivePage} />;
      case 'add-collection-tag':
      case 'edit-collection-tag': return <AddCollectionTag setActivePage={setActivePage} />;
      case 'categories':   return <CategoriesAdmin setActivePage={setActivePage} />;
      case 'add-category':
      case 'edit-category':return <AddCategory setActivePage={setActivePage} />;
      case 'boutiques':    return <BoutiquesAdmin setActivePage={setActivePage} />;
      case 'add-boutique': 
      case 'edit-boutique':return <AddBoutique setActivePage={setActivePage} />;
      case 'settings':     return <Settings />;
      default:             return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <AdminLayout
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
}
