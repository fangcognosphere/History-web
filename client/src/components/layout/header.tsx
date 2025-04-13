import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/hooks/use-auth';
import { Moon, Search, Sun, Menu } from 'lucide-react';

export function Header() {
  const [location, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logoutMutation } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <img src="https://files.catbox.moe/ta56ul.png" alt="Logo" className="h-10 w-auto transition-transform duration-300 group-hover:scale-110" />
              <h1 className="text-xl font-serif font-bold text-primary dark:text-primary transition-colors">Lịch Sử Việt Nam</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link href="/" className="px-3 py-2 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors">
              Trang Chủ
            </Link>
            <Link href="/category/NhanVat" className="px-3 py-2 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors">
              Nhân Vật
            </Link>
            <Link href="/category/SuKien" className="px-3 py-2 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors">
              Sự Kiện
            </Link>
            <Link href="/category/TrieuDai" className="px-3 py-2 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors">
              Thời kỳ
            </Link>
            <Link href="/timeline" className="px-3 py-2 rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors">
              Dòng thời gian
            </Link>
          </nav>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Button */}
            <button 
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={theme === 'dark' ? 'Chuyển chế độ sáng' : 'Chuyển chế độ tối'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </button>
            
            {/* Admin Link */}
            {user && (
              <div className="hidden sm:flex items-center">
                <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors flex items-center space-x-1">
                  <i className="fas fa-user-shield"></i>
                  <span>Quản trị</span>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        
        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="py-3 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm lịch sử..."
                className="w-full p-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 pb-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 animate-slideDown">
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            <Link href="/" className="py-3 font-medium hover:text-primary dark:hover:text-primary transition-colors">
              Trang Chủ
            </Link>
            <Link href="/category/NhanVat" className="py-3 font-medium hover:text-primary dark:hover:text-primary transition-colors">
              Nhân Vật
            </Link>
            <Link href="/category/SuKien" className="py-3 font-medium hover:text-primary dark:hover:text-primary transition-colors">
              Sự Kiện
            </Link>
            <Link href="/category/TrieuDai" className="py-3 font-medium hover:text-primary dark:hover:text-primary transition-colors">
              Thời kỳ
            </Link>
            <Link href="/timeline" className="py-3 font-medium hover:text-primary dark:hover:text-primary transition-colors">
              Dòng thời gian
            </Link>
            {user && (
              <>
                <Link href="/admin" className="py-3 font-medium hover:text-primary dark:hover:text-primary transition-colors flex items-center space-x-1">
                  <i className="fas fa-user-shield"></i>
                  <span>Quản trị</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-3 font-medium hover:text-primary dark:hover:text-primary transition-colors flex items-center space-x-1 text-left w-full"
                  disabled={logoutMutation.isPending}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Đăng xuất</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
