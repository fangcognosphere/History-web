import { Link } from 'wouter';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  link: string;
}

export function CategoryNavigation() {
  const categories: Category[] = [
    {
      id: 'nhan-vat',
      name: 'Nhân Vật',
      icon: 'fas fa-user',
      color: 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300',
      link: '/category/NhanVat'
    },
    {
      id: 'su-kien',
      name: 'Sự Kiện',
      icon: 'fas fa-landmark',
      color: 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300',
      link: '/category/SuKien'
    },
    {
      id: 'trieu-dai',
      name: 'Triều Đại',
      icon: 'fas fa-crown',
      color: 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300',
      link: '/category/TrieuDai'
    },
    {
      id: 'dia-danh',
      name: 'Địa Danh',
      icon: 'fas fa-map-marked-alt',
      color: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300',
      link: '#'
    },
    {
      id: 'van-hoa',
      name: 'Văn Hóa',
      icon: 'fas fa-scroll',
      color: 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300',
      link: '#'
    }
  ];

  return (
    <section id="categories" className="py-8 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto pb-2 space-x-4 -mx-4 px-4 scrollbar-hide">
          {categories.map(category => (
            <Link 
              key={category.id} 
              href={category.link}
              className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 px-4 py-3 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className={`h-10 w-10 rounded-full ${category.color} flex items-center justify-center`}>
                  <i className={category.icon}></i>
                </div>
                <span className="font-medium">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
