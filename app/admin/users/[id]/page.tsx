import { Metadata } from 'next';
import UpdateUserForm from '@/components/admin/UpdateUserForm';
import { getUserById } from '@/lib/actions/user.actions';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Update User',
};

const AdminUserUpdatePage = async ({ params }: Props) => {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default AdminUserUpdatePage;
