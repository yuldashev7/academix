import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function PasswordModal({ open, onClose }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] text-gray-800">
              Parolni o'zgartirish
            </DialogTitle>
            <DialogTitle className="text-gray-800 text-[15px] font-[400]">
              Quyidagi ma'lumotlarni to'diring
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </form>
    </Dialog>
  );
}
