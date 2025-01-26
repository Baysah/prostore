import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { formatId } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import { User } from '@prisma/client';

interface Props {
  users: User[];
}

const UsersList = ({ users }: Props) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{formatId(user.id)}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === 'admin' ? 'default' : 'secondary'}
                >
                  {(user.role).toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button asChild variant={'outline'}>
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                </Button>
                <Button
                  variant={'destructive'}
                >
                  Delete User
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UsersList;
