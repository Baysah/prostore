'use client';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

const DeleteDialog = ({
  id,
  action,
  title,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
  title?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await action(id);

      if (!res.success) {
        toast({
          variant: 'destructive',
          title: 'Error Deleting',
          description: res.message,
        });
      }
      else {
        setIsOpen(false);
        toast({
          variant: 'default',
          title: 'Deleted',
          description: res.message,
        });
      }
    })
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size={'sm'} variant={'destructive'} className="ml-2">
          Delete {title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {title}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {title?.toLowerCase()}? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant={'destructive'}
            size={'sm'}
            disabled={isPending}
            onClick={handleDeleteClick}
          >{isPending ? 'Deleting...' : 'Delete'}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
