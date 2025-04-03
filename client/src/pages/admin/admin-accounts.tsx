import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/admin-layout';
import { getQueryFn, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, UserPlus, Loader2 } from 'lucide-react';

export default function AdminAccounts() {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [accountToDelete, setAccountToDelete] = useState<number | null>(null);

  // Fetch accounts
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['/api/account'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Delete account mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/account/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể xóa tài khoản');
      }
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Tài khoản đã được xóa",
        description: "Tài khoản đã được xóa thành công",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/account'] });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi khi xóa tài khoản",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Change role mutation
  const changeRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: 'Admin' | 'User' }) => {
      const res = await fetch(`/api/account/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vaiTro: role }),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể thay đổi vai trò');
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vai trò đã được cập nhật",
        description: "Vai trò tài khoản đã được cập nhật thành công",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/account'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi khi cập nhật vai trò",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle delete account
  const handleDeleteClick = (id: number) => {
    setAccountToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      deleteMutation.mutate(accountToDelete);
    }
  };

  // Handle role change
  const handleRoleChange = (id: number, currentRole: 'Admin' | 'User') => {
    const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    changeRoleMutation.mutate({ id, role: newRole });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout title="Quản lý tài khoản">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Danh sách tài khoản</h2>
          <Button disabled>
            <UserPlus className="h-4 w-4 mr-2" />
            Tạo tài khoản mới
          </Button>
        </div>

        {/* Accounts table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Tên đăng nhập</TableHead>
                <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
                <TableHead>Vai trò</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Không có tài khoản nào
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account: any) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.id}</TableCell>
                    <TableCell className="font-medium">{account.hoTen}</TableCell>
                    <TableCell>{account.tenDangNhap}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(account.ngayTao)}</TableCell>
                    <TableCell>
                      <Badge variant={account.vaiTro === 'Admin' ? "default" : "secondary"}>
                        {account.vaiTro}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRoleChange(account.id, account.vaiTro)}
                          disabled={changeRoleMutation.isPending}
                        >
                          {changeRoleMutation.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                          {account.vaiTro === 'Admin' ? 'Đổi thành User' : 'Đổi thành Admin'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive" 
                          title="Xóa"
                          onClick={() => handleDeleteClick(account.id)}
                          disabled={deleteMutation.isPending}
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
            <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.
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
              Xóa tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}