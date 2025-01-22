'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utils';

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();


  const handleClick = (direction: string) => {
    const pageValue = direction ==='next' ? Number(page) + 1 : Number(page) - 1;
    const newURL = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName ?? 'page',
      value: pageValue.toString(),
    });
    router.push(newURL);
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant={'outline'}
        disabled={Number(page) <= 1}
        onClick={() => handleClick('prev')}
      >
        <ArrowLeftCircle />
        <span>Prev</span>
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button
        variant={'outline'}
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick('next')}
      >
        <ArrowRightCircle />
        <span>Next</span>
      </Button>
    </div>
  );
};

export default Pagination;
