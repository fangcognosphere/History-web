import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/admin-layout';
import { getQueryFn, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { Link } from 'wouter';

export default function AdminHistoricalFigures() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [figureToDelete, setFigureToDelete] = useState<number | null>(null);

  // Fetch historical figures
  const { data: figures = [], isLoading } = useQuery({
    queryKey: ['/api/nhanvat'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/nhanvat/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể xóa nhân vật');
      }
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Nhân vật đã được xóa",
        description: "Nhân vật lịch sử đã được xóa thành công",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/nhanvat'] });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi khi xóa nhân vật",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle delete click
  const handleDeleteClick = (id: number) => {
    setFigureToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (figureToDelete) {
      deleteMutation.mutate(figureToDelete);
    }
  };

  // Filter figures based on search query
  const filteredFigures = Array.isArray(figures) 
    ? figures.filter((figure: any) => {
        return searchQuery === '' || 
          figure.tenNhanVat.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (figure.moTa && figure.moTa.toLowerCase().includes(searchQuery.toLowerCase()));
      })
    : [];

  // Format year/date
  const formatYear = (year: number | null) => {
    if (!year) return 'Không rõ';
    return year;
  };

  return (
    <AdminLayout title="Quản lý nhân vật lịch sử">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Danh sách nhân vật lịch sử</h2>
          <Link href="/admin/historical-figures/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhân vật mới
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm nhân vật..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Figures table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Tên nhân vật</TableHead>
                <TableHead className="hidden md:table-cell">Năm sinh</TableHead>
                <TableHead className="hidden md:table-cell">Năm mất</TableHead>
                <TableHead className="hidden md:table-cell">Triều đại</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredFigures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Không tìm thấy nhân vật lịch sử nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredFigures.map((figure: any) => (
                  <TableRow key={figure.id}>
                    <TableCell>{figure.id}</TableCell>
                    <TableCell className="font-medium">{figure.tenNhanVat}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatYear(figure.namSinh)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatYear(figure.namMat)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {figure.trieuDai?.tenTrieuDai || 'Không rõ'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/nhanvat/${figure.id}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Xem">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/historical-figures/edit/${figure.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Sửa">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive" 
                          title="Xóa"
                          onClick={() => handleDeleteClick(figure.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa nhân vật</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa nhân vật này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa nhân vật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}