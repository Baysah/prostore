import { auth } from "@/auth";
import DeleteDialog from "@/components/shared/DeleteDialog";
import Pagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Admin - Users',
}

const UsersPage = async(props: {searchParams: Promise<{ page: string }>}) => {
    const { page = '1' } = await props.searchParams;
    const session = await auth();
    if(session?.user?.role !== 'admin') return notFound();

    //get all users
    const users = await getAllUsers({
        page: Number(page),
        limit: 10,
    });

    console.log(users)
    return (
      <div className="space-y-2 ">
        <div className="flex-between">
          <h1 className="h2-bold">Admin - Users</h1>
          <Button asChild>
            <Link href={'/admin/users/create'}>Create New User</Link>
          </Button>
        </div>
        <Table className="overflow-x-auto">
          <TableHeader>
            <TableRow className="uppercase">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role.toUpperCase()}</Badge></TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild>
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog
                    id={user.id}
                    action={deleteUser}
                    title="User"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination page={page} totalPages={users.totalPages} />
        )}
      </div>
    );
}
 
export default UsersPage