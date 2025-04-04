import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/contexts/theme-context';
import { 
  Newspaper, 
  Image, 
  History, 
  User, 
  Award, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Moon, 
  Sun 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location, navigate] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/');
  };

  const menuItems = [
    { name: 'Trang chủ', path: '/admin', icon: <Home size={16} /> },
    { name: 'Bài viết', path: '/admin/articles', icon: <Newspaper size={16} /> },
    { name: 'Hình ảnh & Video', path: '/admin/media', icon: <Image size={16} /> },
    { name: 'Tài khoản', path: '/admin/accounts', icon: <User size={16} /> },
    { name: 'Nhân vật lịch sử', path: '/admin/historical-figures', icon: <Award size={16} /> },
    { name: 'Sự kiện lịch sử', path: '/admin/historical-events', icon: <History size={16} /> },
    { name: 'Thời kỳ', path: '/admin/dynasties', icon: <FileText size={16} /> },
  ];
  
  const pageTitle = `${title} | Quản trị`;

  // If user is not logged in, we'll let ProtectedRoute handle the redirect
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      
      {/* Mobile header */}
      <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between p-4 sticky top-0 z-30">
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        
        <h1 className="font-semibold text-lg">{title}</h1>
        
        <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <img src="https://files.catbox.moe/ta56ul.png" alt="Logo" className="h-8 w-auto mr-2" />
          <h1 className="font-bold text-lg">Hệ thống quản trị</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  location === item.path
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User size={18} />
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.hoTen}</p>
              <p className="text-xs text-gray-500">Quản trị viên</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun size={16} className="mr-3" /> : <Moon size={16} className="mr-3" />}
              {theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
            </button>
            
            <Link
              href="/"
              className="w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Home size={16} className="mr-3" />
              Về trang chủ
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              disabled={logoutMutation.isPending}
            >
              <LogOut size={16} className="mr-3" />
              {logoutMutation.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className={`lg:ml-64 transition-all duration-200 ease-in-out min-h-screen flex flex-col ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Desktop header */}
        <header className="hidden lg:flex bg-white dark:bg-gray-800 shadow-sm items-center justify-between p-4 sticky top-0 z-20">
          <h1 className="font-semibold text-lg">{title}</h1>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
            >
              <Home size={16} className="mr-1" />
              Về trang chủ
            </Link>
            
            <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="text-sm"
              disabled={logoutMutation.isPending}
            >
              <LogOut size={14} className="mr-1" />
              Đăng xuất
            </Button>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
