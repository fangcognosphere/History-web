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
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">VN</span>
              </div>
              <h1 className="text-xl font-serif font-bold text-primary dark:text-primary">Lịch Sử Việt Nam</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="font-medium hover:text-primary dark:hover:text-primary">
              Trang Chủ
            </Link>
            <Link href="/category/NhanVat" className="font-medium hover:text-primary dark:hover:text-primary">
              Nhân Vật
            </Link>
            <Link href="/category/SuKien" className="font-medium hover:text-primary dark:hover:text-primary">
              Sự Kiện
            </Link>
            <Link href="/category/TrieuDai" className="font-medium hover:text-primary dark:hover:text-primary">
              Triều Đại
            </Link>
          </nav>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              onClick={toggleSearch}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={theme === 'dark' ? 'Chuyển chế độ sáng' : 'Chuyển chế độ tối'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-700" />
              )}
            </button>
            
            {/* Admin Link */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-3">
                <Link href="/admin" className="text-sm font-medium hover:text-primary dark:hover:text-primary flex items-center space-x-1">
                  <i className="fas fa-user-shield"></i>
                  <span>Quản trị</span>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-sm"
                  disabled={logoutMutation.isPending}
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Link href="/auth" className="hidden sm:flex items-center space-x-1 text-sm font-medium hover:text-primary dark:hover:text-primary">
                <i className="fas fa-sign-in-alt"></i>
                <span>Đăng nhập</span>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        
        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm lịch sử..."
                className="w-full p-2 pl-10 rounded-lg"
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
        <div className="md:hidden px-4 pb-4 bg-white dark:bg-gray-800">
          <div className="flex flex-col space-y-3">
            <Link href="/" className="py-2 font-medium hover:text-primary dark:hover:text-primary">
              Trang Chủ
            </Link>
            <Link href="/category/NhanVat" className="py-2 font-medium hover:text-primary dark:hover:text-primary">
              Nhân Vật
            </Link>
            <Link href="/category/SuKien" className="py-2 font-medium hover:text-primary dark:hover:text-primary">
              Sự Kiện
            </Link>
            <Link href="/category/TrieuDai" className="py-2 font-medium hover:text-primary dark:hover:text-primary">
              Triều Đại
            </Link>
            {user ? (
              <>
                <Link href="/admin" className="py-2 font-medium hover:text-primary dark:hover:text-primary flex items-center space-x-1">
                  <i className="fas fa-user-shield"></i>
                  <span>Quản trị</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 font-medium hover:text-primary dark:hover:text-primary flex items-center space-x-1 text-left"
                  disabled={logoutMutation.isPending}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <Link href="/auth" className="py-2 font-medium hover:text-primary dark:hover:text-primary flex items-center space-x-1">
                <i className="fas fa-sign-in-alt"></i>
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
