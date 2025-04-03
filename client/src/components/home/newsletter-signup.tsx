import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Đăng ký thành công!",
        description: "Cảm ơn bạn đã đăng ký nhận tin.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-12 bg-gradient-to-r from-primary-800 to-primary-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4">Đăng Ký Nhận Tin</h2>
          <p className="text-lg mb-8 text-white/90">Cập nhật những bài viết mới nhất về lịch sử và văn hóa Việt Nam hàng tuần.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-grow">
              <Input 
                type="email" 
                placeholder="Email của bạn" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800 h-full"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-white text-primary-700 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký'}
            </Button>
          </form>
          
          <p className="text-sm mt-4 text-white/80">Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.</p>
        </div>
      </div>
    </section>
  );
}
