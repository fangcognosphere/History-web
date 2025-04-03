import { AdminLayout } from '@/components/layout/admin-layout';
import { MediaManager } from '@/components/admin/media-manager';

export default function AdminMedia() {
  return (
    <AdminLayout title="Quản lý Media">
      <MediaManager />
    </AdminLayout>
  );
}
