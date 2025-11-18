import { Button } from '@/components/ui/button';
import { paginationT } from '../types/types';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
}: paginationT) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <Button
        disabled={currentPage === 1}
        variant={'outline'}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <div className="flex gap-[10px]">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? 'default' : 'outline'}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          disabled={currentPage === totalPages}
          variant={'outline'}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
export default Pagination;
