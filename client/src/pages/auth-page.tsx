import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Link } from 'wouter';

// Login form schema
const loginSchema = z.object({
  tenDangNhap: z.string().min(1, 'Tên đăng nhập là bắt buộc'),
  matKhau: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

// Registration form schema
const registrationSchema = z.object({
  hoTen: z.string().min(1, 'Họ tên là bắt buộc'),
  tenDangNhap: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  matKhau: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  xacNhanMatKhau: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
}).refine(data => data.matKhau === data.xacNhanMatKhau, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['xacNhanMatKhau'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [location, navigate] = useLocation();
  const { user, isLoading, loginMutation } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tenDangNhap: '',
      matKhau: '',
    },
  });

  // Registration form
  const registrationForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      hoTen: '',
      tenDangNhap: '',
      matKhau: '',
      xacNhanMatKhau: '',
    },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const onRegistrationSubmit = (values: RegistrationFormValues) => {
    // Since registration is disabled for regular users in this app,
    // we'll show an alert instead
    alert('Đăng ký tài khoản mới không khả dụng. Vui lòng liên hệ quản trị viên.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-xl overflow-hidden shadow-xl">
        {/* Auth form */}
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="mb-6">
            <Link href="/">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">VN</span>
                </div>
                <h1 className="text-xl font-serif font-bold text-primary dark:text-primary">Lịch Sử Việt Nam</h1>
              </div>
            </Link>
            <h1 className="text-2xl font-bold">Đăng nhập vào hệ thống quản trị</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Đăng nhập để quản lý nội dung bài viết, hình ảnh và video.
            </p>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register">Đăng ký</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="tenDangNhap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên đăng nhập" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="matKhau"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng nhập
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Registration Form */}
            <TabsContent value="register">
              <Form {...registrationForm}>
                <form onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)} className="space-y-4">
                  <FormField
                    control={registrationForm.control}
                    name="hoTen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập họ tên" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="tenDangNhap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên đăng nhập" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="matKhau"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="xacNhanMatKhau"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Nhập lại mật khẩu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled>
                    Đăng ký
                  </Button>
                  
                  <p className="text-sm text-center text-muted-foreground">
                    Đăng ký tài khoản mới hiện không khả dụng. Vui lòng liên hệ quản trị viên.
                  </p>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              Quay lại trang chủ
            </Link>
          </div>
        </div>

        {/* Hero section */}
        <div className="hidden lg:flex relative bg-gradient-to-r from-primary-800 to-primary-700 text-white p-8 flex-col justify-center">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559125148-869baf508c95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-4">Hệ thống quản trị</h2>
            <p className="mb-6">
              Quản lý nội dung, hình ảnh và video cho website thông tin lịch sử Việt Nam.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>Quản lý bài viết về nhân vật, sự kiện và triều đại lịch sử</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>Tải lên và quản lý thư viện hình ảnh, video</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>Theo dõi số liệu lượt xem bài viết</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>Cập nhật nội dung một cách dễ dàng</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
