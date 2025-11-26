import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function PhotoModal({ open, onClose }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-medium text-[18px]">
              Afsuski hozir rasim qo'yish mavjud emas
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </form>
    </Dialog>
  );
}
