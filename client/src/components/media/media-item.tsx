import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface MediaItemProps {
  type: 'image' | 'video';
  src: string;
  title?: string;
  description?: string;
  className?: string;
}

export function MediaItem({ type, src, title, description, className = '' }: MediaItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <div
        className={`relative group overflow-hidden rounded-lg shadow-md cursor-pointer ${className}`}
        onClick={openDialog}
      >
        {type === 'image' ? (
          <img
            src={src}
            alt={title || 'Media item'}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="relative bg-gray-100 dark:bg-gray-800 w-full h-full">
            {src.startsWith('/uploads/') ? (
              <video className="w-full h-full object-cover">
                <source src={src} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1561611030-b373736f0e0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover opacity-75"
                />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary-700/80 flex items-center justify-center text-white">
                <i className="fas fa-play text-xl"></i>
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <i className={`${type === 'video' ? 'fas fa-play-circle text-3xl' : 'fas fa-search-plus text-xl'} text-white`}></i>
        </div>

        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
            <h4 className="text-white text-sm font-medium truncate">{title}</h4>
            {type === 'video' && (
              <div className="flex items-center mt-1">
                <i className="fas fa-video text-xs text-gray-300 mr-1"></i>
                <span className="text-xs text-gray-300">Video</span>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          {type === 'image' ? (
            <img
              src={src}
              alt={title || 'Media item'}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : (
            <div className="w-full max-h-[80vh] aspect-video bg-black">
              {src.startsWith('/uploads/') ? (
                <video controls className="w-full h-full">
                  <source src={src} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video tag.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <a 
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline flex items-center"
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Xem video (link ngoài)
                  </a>
                </div>
              )}
            </div>
          )}
          {(title || description) && (
            <div className="p-4 bg-white dark:bg-gray-800">
              {title && <h3 className="font-medium text-lg">{title}</h3>}
              {description && <p className="mt-1 text-gray-600 dark:text-gray-300">{description}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
