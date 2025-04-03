interface TimelineEvent {
  year: string;
  content: string;
  position: 'left' | 'right';
}

export function TimelineSection() {
  const timelineEvents: TimelineEvent[] = [
    {
      year: '939',
      content: 'Ngô Quyền đánh bại quân Nam Hán trên sông Bạch Đằng, chấm dứt 1000 năm Bắc thuộc',
      position: 'left'
    },
    {
      year: '1010',
      content: 'Lý Thái Tổ dời đô từ Hoa Lư về Thăng Long (Hà Nội ngày nay)',
      position: 'right'
    },
    {
      year: '1288',
      content: 'Trần Hưng Đạo chỉ huy quân dân đại thắng quân Nguyên Mông lần thứ ba trên sông Bạch Đằng',
      position: 'left'
    },
    {
      year: '1945',
      content: 'Cách mạng Tháng Tám thành công, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập',
      position: 'right'
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-8 text-center">Dòng Thời Gian Lịch Sử</h2>
        
        <div className="relative">
          {/* Timeline center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200 dark:bg-primary-900"></div>
          
          <div className="relative">
            {timelineEvents.map((event, index) => (
              <div 
                key={index} 
                className={`mb-8 flex justify-between items-center w-full ${
                  event.position === 'right' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="order-1 w-5/12"></div>
                <div className="z-10 flex items-center order-1 bg-primary shadow-xl w-8 h-8 rounded-full">
                  <h1 className="mx-auto text-white font-semibold text-lg"></h1>
                </div>
                <div className="order-1 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md w-5/12 px-6 py-4">
                  <h3 className="font-bold text-primary dark:text-primary-400 text-lg">{event.year}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{event.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <a href="#" className="inline-block bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Xem đầy đủ dòng thời gian
          </a>
        </div>
      </div>
    </section>
  );
}
