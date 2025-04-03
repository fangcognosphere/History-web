import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { ImageUpload } from '@/components/ui/image-upload';
import { VideoUpload } from '@/components/ui/video-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Trash2, Edit, Eye, Image, FileVideo } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function MediaManager() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('images');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<{ id: number, type: 'image' | 'video' } | null>(null);
  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch all articles for the dropdown
  const { data: articles = [] } = useQuery({
    queryKey: ['/api/article'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch images
  const { 
    data: images = [], 
    isLoading: isImagesLoading,
    refetch: refetchImages
  } = useQuery({
    queryKey: ['/api/image/article', selectedArticle || 'all'],
    queryFn: async ({ queryKey }) => {
      const articleId = queryKey[1];
      if (articleId === 'all') {
        // This is a placeholder - in a real app, you'd need an API endpoint to get all images
        // For now, we'll just return an empty array when 'all' is selected
        return [];
      }
      const res = await fetch(`/api/image/article/${articleId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch images');
      return res.json();
    },
    enabled: !!selectedArticle && selectedArticle !== 'all',
  });

  // Fetch videos
  const { 
    data: videos = [], 
    isLoading: isVideosLoading,
    refetch: refetchVideos
  } = useQuery({
    queryKey: ['/api/video/article', selectedArticle || 'all'],
    queryFn: async ({ queryKey }) => {
      const articleId = queryKey[1];
      if (articleId === 'all') {
        // This is a placeholder - in a real app, you'd need an API endpoint to get all videos
        // For now, we'll just return an empty array when 'all' is selected
        return [];
      }
      const res = await fetch(`/api/video/article/${articleId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch videos');
      return res.json();
    },
    enabled: !!selectedArticle && selectedArticle !== 'all',
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload image');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã tải lên hình ảnh mới',
      });
      // Reset form
      setSelectedImage(null);
      setImageTitle('');
      setImageDescription('');
      // Refetch images
      refetchImages();
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Upload video mutation
  const uploadVideoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/video', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload video');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã tải lên video mới',
      });
      // Reset form
      setSelectedVideo(null);
      setVideoLink('');
      setVideoTitle('');
      setVideoDescription('');
      // Refetch videos
      refetchVideos();
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete media mutation
  const deleteMediaMutation = useMutation({
    mutationFn: async ({ id, type }: { id: number, type: 'image' | 'video' }) => {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to delete ${type}`);
      }
      return;
    },
    onSuccess: (_, variables) => {
      toast({
        title: 'Thành công',
        description: `Đã xóa ${variables.type === 'image' ? 'hình ảnh' : 'video'}`,
      });
      // Close dialog
      setIsDeleteDialogOpen(false);
      // Refetch media
      if (variables.type === 'image') refetchImages();
      else refetchVideos();
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
      setIsDeleteDialogOpen(false);
    },
  });

  // Edit media mutation
  const editMediaMutation = useMutation({
    mutationFn: async ({ id, type, formData }: { id: number, type: 'image' | 'video', formData: FormData }) => {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to update ${type}`);
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: 'Thành công',
        description: `Đã cập nhật ${variables.type === 'image' ? 'hình ảnh' : 'video'}`,
      });
      // Close dialog
      setIsEditDialogOpen(false);
      setEditingMedia(null);
      // Refetch media
      if (variables.type === 'image') refetchImages();
      else refetchVideos();
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleImageUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      toast({
        title: 'Chưa chọn hình ảnh',
        description: 'Vui lòng chọn hình ảnh để tải lên',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('tieuDe', imageTitle);
    formData.append('moTa', imageDescription);
    if (selectedArticle && selectedArticle !== 'all') {
      formData.append('baiVietId', selectedArticle);
    }

    uploadImageMutation.mutate(formData);
  };

  const handleVideoUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    if (selectedVideo) {
      formData.append('video', selectedVideo);
    } else if (videoLink) {
      formData.append('duongDan', videoLink);
    } else {
      toast({
        title: 'Chưa có video',
        description: 'Vui lòng chọn file video hoặc nhập đường dẫn',
        variant: 'destructive',
      });
      return;
    }
    
    formData.append('tieuDe', videoTitle);
    formData.append('moTa', videoDescription);
    if (selectedArticle && selectedArticle !== 'all') {
      formData.append('baiVietId', selectedArticle);
    }

    uploadVideoMutation.mutate(formData);
  };

  const openDeleteDialog = (id: number, type: 'image' | 'video') => {
    setMediaToDelete({ id, type });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (mediaToDelete) {
      deleteMediaMutation.mutate(mediaToDelete);
    }
  };

  const openEditDialog = (media: any, type: 'image' | 'video') => {
    setEditingMedia({ ...media, type });
    if (type === 'image') {
      setImageTitle(media.tieuDe || '');
      setImageDescription(media.moTa || '');
    } else {
      setVideoTitle(media.tieuDe || '');
      setVideoDescription(media.moTa || '');
      setVideoLink(media.duongDan || '');
    }
    setIsEditDialogOpen(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;

    const formData = new FormData();
    
    if (editingMedia.type === 'image') {
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      formData.append('tieuDe', imageTitle);
      formData.append('moTa', imageDescription);
      if (editingMedia.baiVietId) {
        formData.append('baiVietId', editingMedia.baiVietId.toString());
      }
    } else {
      if (selectedVideo) {
        formData.append('video', selectedVideo);
      } else if (videoLink) {
        formData.append('duongDan', videoLink);
      }
      formData.append('tieuDe', videoTitle);
      formData.append('moTa', videoDescription);
      if (editingMedia.baiVietId) {
        formData.append('baiVietId', editingMedia.baiVietId.toString());
      }
    }

    editMediaMutation.mutate({
      id: editingMedia.id,
      type: editingMedia.type,
      formData
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Quản lý media</h2>
        
        <div className="w-full sm:w-64">
          <Select
            value={selectedArticle || ''}
            onValueChange={setSelectedArticle}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn bài viết" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả bài viết</SelectItem>
              {articles.map((article: any) => (
                <SelectItem key={article.id} value={article.id.toString()}>
                  {article.tieuDe}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="images" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          <TabsTrigger value="videos">Video</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tải lên hình ảnh mới</CardTitle>
            </CardHeader>
            <form onSubmit={handleImageUpload}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ImageUpload 
                      onImageSelected={setSelectedImage}
                      className="mb-4"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image-title">Tiêu đề</Label>
                      <Input
                        id="image-title"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        placeholder="Nhập tiêu đề hình ảnh"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-description">Mô tả</Label>
                      <Textarea
                        id="image-description"
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        placeholder="Nhập mô tả hình ảnh"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={uploadImageMutation.isPending || !selectedImage}>
                  {uploadImageMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tải lên
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isImagesLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : images.length === 0 ? (
              <div className="col-span-full bg-muted rounded-lg p-6 text-center">
                <Image className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Không có hình ảnh</h3>
                <p className="text-muted-foreground">
                  {selectedArticle 
                    ? "Bài viết này chưa có hình ảnh nào. Hãy tải lên hình ảnh đầu tiên!" 
                    : "Vui lòng chọn một bài viết để xem hình ảnh."}
                </p>
              </div>
            ) : (
              images.map((image: any) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img 
                      src={image.duongDan} 
                      alt={image.tieuDe || 'Hình ảnh'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm truncate">{image.tieuDe || 'Không có tiêu đề'}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{image.moTa || 'Không có mô tả'}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(image, 'image')}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(image.id, 'image')}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tải lên video mới</CardTitle>
            </CardHeader>
            <form onSubmit={handleVideoUpload}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <VideoUpload 
                      onVideoSelected={setSelectedVideo}
                      onExternalLinkChanged={setVideoLink}
                      className="mb-4"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="video-title">Tiêu đề</Label>
                      <Input
                        id="video-title"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="Nhập tiêu đề video"
                      />
                    </div>
                    <div>
                      <Label htmlFor="video-description">Mô tả</Label>
                      <Textarea
                        id="video-description"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Nhập mô tả video"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={uploadVideoMutation.isPending || (!selectedVideo && !videoLink)}>
                  {uploadVideoMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tải lên
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isVideosLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : videos.length === 0 ? (
              <div className="col-span-full bg-muted rounded-lg p-6 text-center">
                <FileVideo className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Không có video</h3>
                <p className="text-muted-foreground">
                  {selectedArticle 
                    ? "Bài viết này chưa có video nào. Hãy tải lên video đầu tiên!" 
                    : "Vui lòng chọn một bài viết để xem video."}
                </p>
              </div>
            ) : (
              videos.map((video: any) => (
                <Card key={video.id}>
                  <div className="relative h-48 bg-muted flex items-center justify-center">
                    {video.duongDan && video.duongDan.startsWith('/uploads/') ? (
                      <video controls className="w-full h-full object-cover">
                        <source src={video.duongDan} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ video tag.
                      </video>
                    ) : (
                      <div className="text-center p-4">
                        <FileVideo className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs">{video.duongDan}</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm truncate">{video.tieuDe || 'Không có tiêu đề'}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{video.moTa || 'Không có mô tả'}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(video, 'video')}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(video.id, 'video')}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa {mediaToDelete?.type === 'image' ? 'hình ảnh' : 'video'} này không?</p>
          <p className="text-sm text-muted-foreground">Hành động này không thể hoàn tác.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMediaMutation.isPending}
            >
              {deleteMediaMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa {editingMedia?.type === 'image' ? 'hình ảnh' : 'video'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            {editingMedia?.type === 'image' ? (
              <>
                <div className="mb-4">
                  <div className="rounded-md overflow-hidden max-h-48 mb-4">
                    <img 
                      src={editingMedia?.duongDan} 
                      alt={editingMedia?.tieuDe || 'Preview'} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <ImageUpload 
                    onImageSelected={setSelectedImage}
                    defaultImage={editingMedia?.duongDan}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-image-title">Tiêu đề</Label>
                  <Input
                    id="edit-image-title"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    placeholder="Nhập tiêu đề hình ảnh"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-image-description">Mô tả</Label>
                  <Textarea
                    id="edit-image-description"
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder="Nhập mô tả hình ảnh"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <VideoUpload 
                    onVideoSelected={setSelectedVideo}
                    onExternalLinkChanged={setVideoLink}
                    defaultVideo={editingMedia?.duongDan}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-video-title">Tiêu đề</Label>
                  <Input
                    id="edit-video-title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Nhập tiêu đề video"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-video-description">Mô tả</Label>
                  <Textarea
                    id="edit-video-description"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Nhập mô tả video"
                    rows={3}
                  />
                </div>
              </>
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button 
                type="submit"
                disabled={editMediaMutation.isPending}
              >
                {editMediaMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
