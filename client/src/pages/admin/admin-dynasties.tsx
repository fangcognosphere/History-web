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

export default function AdminDynasties() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [dynastyToDelete, setDynastyToDelete] = useState<number | null>(null);

  // Fetch dynasties
  const { data: dynasties = [], isLoading } = useQuery({
    queryKey: ['/api/trieudai'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/trieudai/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể xóa thời kỳ');
      }
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Thời kỳ đã được xóa",
        description: "Thời kỳ đã được xóa thành công",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/trieudai'] });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi khi xóa thời kỳ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle delete click
  const handleDeleteClick = (id: number) => {
    setDynastyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (dynastyToDelete) {
      deleteMutation.mutate(dynastyToDelete);
    }
  };

  // Filter dynasties based on search query
  const filteredDynasties = Array.isArray(dynasties) 
    ? dynasties.filter((dynasty: any) => {
        return searchQuery === '' || 
          dynasty.tenTrieuDai.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (dynasty.moTa && dynasty.moTa.toLowerCase().includes(searchQuery.toLowerCase()));
      })
    : [];

  // Format year/date
  const formatYear = (year: number | null) => {
    if (!year) return 'Không rõ';
    return year;
  };

  return (
    <AdminLayout title="Quản lý thời kỳ">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Danh sách thời kỳ</h2>
          <Link href="/admin/dynasties/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm thời kỳ mới
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm thời kỳ..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dynasties table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Tên thời kỳ</TableHead>
                <TableHead className="hidden md:table-cell">Năm bắt đầu</TableHead>
                <TableHead className="hidden md:table-cell">Năm kết thúc</TableHead>
                <TableHead className="hidden md:table-cell">Kinh đô</TableHead>
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
              ) : filteredDynasties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Không tìm thấy thời kỳ nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredDynasties.map((dynasty: any) => (
                  <TableRow key={dynasty.id}>
                    <TableCell>{dynasty.id}</TableCell>
                    <TableCell className="font-medium">{dynasty.tenTrieuDai}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatYear(dynasty.batDau)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatYear(dynasty.ketThuc)}</TableCell>
                    <TableCell className="hidden md:table-cell">{dynasty.kinhDo || 'Không rõ'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/trieudai/${dynasty.id}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Xem">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/dynasties/edit/${dynasty.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Sửa">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive" 
                          title="Xóa"
                          onClick={() => handleDeleteClick(dynasty.id)}
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
            <DialogTitle>Xác nhận xóa thời kỳ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thời kỳ này? Hành động này không thể hoàn tác.
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
              Xóa thời kỳ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}