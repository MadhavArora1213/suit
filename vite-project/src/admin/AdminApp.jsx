import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import GalleryAdmin from './pages/GalleryAdmin';
import HeroSection from './pages/HeroSection';
import LookbookAdmin from './pages/LookbookAdmin';
import Promotions from './pages/Promotions';
import TestimonialsAdmin from './pages/TestimonialsAdmin';
import CategoriesAdmin from './pages/CategoriesAdmin';
import DiscountsAdmin from './pages/DiscountsAdmin';
import Settings from './pages/Settings';

export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <Dashboard setActivePage={setActivePage} />;
      case 'products':     return <Products setActivePage={setActivePage} />;
      case 'add-product':  return <AddProduct setActivePage={setActivePage} />;
      case 'orders':       return <Orders />;
      case 'gallery':      return <GalleryAdmin />;
      case 'hero':         return <HeroSection />;
      case 'lookbook':     return <LookbookAdmin />;
      case 'promotions':   return <Promotions />;
      case 'testimonials': return <TestimonialsAdmin />;
      case 'discounts':    return <DiscountsAdmin />;
      case 'categories':   return <CategoriesAdmin />;
      case 'settings':     return <Settings />;
      default:             return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <AdminLayout
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={() => setIsLoggedIn(false)}
    >
      {renderPage()}
    </AdminLayout>
  );
}
