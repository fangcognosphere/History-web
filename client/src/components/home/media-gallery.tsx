import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  title: string;
}

export function MediaGallery() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  
  const galleryItems: MediaItem[] = [
    {
      id: '1',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1543158266-0066955047b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      alt: 'Văn Miếu Quốc Tử Giám',
      title: 'Văn Miếu Quốc Tử Giám'
    },
    {
      id: '2',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1575396565848-f9f8e4734224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      alt: 'Chùa Một Cột',
      title: 'Chùa Một Cột'
    },
    {
      id: '3',
      type: 'video',
      src: 'https://images.unsplash.com/photo-1561611030-b373736f0e0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      alt: 'Cố đô Huế',
      title: 'Cố đô Huế'
    },
    {
      id: '4',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1571424161765-c4080147f74f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      alt: 'Thành cổ Quảng Trị',
      title: 'Thành cổ Quảng Trị'
    }
  ];

  const openMediaDialog = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Thư Viện Hình Ảnh & Video</h2>
          <a href="#" className="text-primary dark:text-primary hover:underline font-medium">
            Xem tất cả
          </a>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map(item => (
            <div 
              key={item.id} 
              className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => openMediaDialog(item)}
            >
              <img 
                src={item.src} 
                alt={item.alt} 
                className="w-full h-44 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i className={`${item.type === 'video' ? 'fas fa-play-circle text-3xl' : 'fas fa-search-plus text-xl'} text-white`}></i>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                <h4 className="text-white text-sm font-medium truncate">{item.title}</h4>
                {item.type === 'video' && (
                  <div className="flex items-center mt-1">
                    <i className="fas fa-video text-xs text-gray-300 mr-1"></i>
                    <span className="text-xs text-gray-300">Video</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          {selectedMedia?.type === 'image' ? (
            <img 
              src={selectedMedia.src} 
              alt={selectedMedia.alt} 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : (
            <div className="aspect-video bg-black">
              <div className="w-full h-full flex items-center justify-center text-white">
                <i className="fas fa-play-circle text-6xl"></i>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
