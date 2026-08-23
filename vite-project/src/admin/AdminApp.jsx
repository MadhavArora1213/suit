// Force HMR trigger for new routes
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
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
import ReviewsAdmin from './pages/ReviewsAdmin';
import CouponsAdmin from './pages/CouponsAdmin';
import FestiveItemsAdmin from './pages/FestiveItemsAdmin';
import AddFestiveItem from './pages/AddFestiveItem';

export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    document.title = 'GURNAAZ Admin Panel';
    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('robots', 'noindex, nofollow, noarchive, nosnippet');
    setMeta('description', 'Admin panel - not for public access.');

    const setOG = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setOG('og:robots', 'noindex, nofollow');
  }, []);
  const getInitialAdminPage = () => {
    const path = window.location.pathname;
    if (path.startsWith('/admin/')) {
      const page = path.replace('/admin/', '');
      return page || 'dashboard';
    }
    return 'dashboard';
  };

  const [activePage, setActivePage] = useState(getInitialAdminPage());
  const [editProduct, setEditProduct] = useState(null);
  const [editBoutique, setEditBoutique] = useState(null);
  const [editCollection, setEditCollection] = useState(null);
  const [editCollectionTag, setEditCollectionTag] = useState(null);
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
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.email.toLowerCase()));
            if (adminDoc.exists()) {
              setIsLoggedIn(true);
            } else {
              // Kick out non-admin users
              await signOut(auth);
              setIsLoggedIn(false);
            }
          } catch (err) {
            console.error("Admin verification error", err);
            await signOut(auth);
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
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
      case 'products':     return <Products setActivePage={setActivePage} onEditProduct={(p) => { setEditProduct(p); setActivePage('add-product'); }} />;
      case 'add-product':  return <AddProduct setActivePage={setActivePage} editProduct={editProduct} />;
      case 'festive-items':return <FestiveItemsAdmin setActivePage={setActivePage} />;
      case 'add-festive-item':
      case 'edit-festive-item':return <AddFestiveItem setActivePage={setActivePage} />;
      case 'orders':       return <Orders />;
      case 'reviews':      return <ReviewsAdmin />;
      case 'coupons':      return <CouponsAdmin />;
      case 'support':      return <SupportAdmin />;
      case 'users':        return <UsersAdmin />;
      case 'collections':  return <CollectionsAdmin setActivePage={setActivePage} onEditCollection={(c) => { setEditCollection(c); setActivePage('edit-collection'); }} />;
      case 'add-collection':
      case 'edit-collection':return <AddCollection setActivePage={setActivePage} editCollection={editCollection} />;
      case 'collection-tags': return <CollectionTagsAdmin setActivePage={setActivePage} onEditCollectionTag={(t) => { setEditCollectionTag(t); setActivePage('edit-collection-tag'); }} />;
      case 'add-collection-tag':
      case 'edit-collection-tag': return <AddCollectionTag setActivePage={setActivePage} editCollectionTag={editCollectionTag} />;
      case 'categories':   return <CategoriesAdmin setActivePage={setActivePage} />;
      case 'add-category':
      case 'edit-category':return <AddCategory setActivePage={setActivePage} />;
      case 'boutiques':    return <BoutiquesAdmin setActivePage={setActivePage} onEditBoutique={(b) => { setEditBoutique(b); setActivePage('edit-boutique'); }} />;
      case 'add-boutique': 
      case 'edit-boutique':return <AddBoutique setActivePage={setActivePage} editBoutique={editBoutique} />;
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
