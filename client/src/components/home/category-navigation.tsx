import { Link } from 'wouter';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  color: string;
  link: string;
  description: string;
}

export function CategoryNavigation() {
  const categories: Category[] = [
    {
      id: 'nhan-vat',
      name: 'Nhân Vật Lịch Sử',
      imageUrl: 'https://files.catbox.moe/bhwnlt.jpg',
      color: 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300',
      link: '/category/NhanVat',
      description: 'Khám phá những nhân vật đã làm nên lịch sử dân tộc Việt Nam qua các thời kỳ'
    },
    {
      id: 'su-kien',
      name: 'Sự Kiện Lịch Sử',
      imageUrl: 'https://files.catbox.moe/kw6h4x.jpg',
      color: 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300',
      link: '/category/SuKien',
      description: 'Tìm hiểu về các sự kiện quan trọng đã định hình nên lịch sử Việt Nam'
    },
    {
      id: 'trieu-dai',
      name: 'Thời Kỳ Lịch Sử',
      imageUrl: 'https://files.catbox.moe/3oi8ma.jpg',
      color: 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300',
      link: '/category/TrieuDai',
      description: 'Khám phá các thời kỳ từ thời Vua Hùng dựng nước đến nay'
    }
  ];

  return (
    <section id="featured" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-10 text-center">Khám Phá Lịch Sử Việt Nam</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link 
              key={category.id} 
              href={category.link}
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-full h-40 overflow-hidden">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{category.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                  <span className="inline-flex items-center text-primary font-medium">
                    Xem thêm
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
