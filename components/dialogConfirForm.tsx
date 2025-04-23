import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

export default function DialogConfirmForm({
  open,
  title,
  text,
  setOpen,
}: {
  open: boolean;
  title: string;
  text: string;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-[30vw]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{text}</DialogDescription>
          <div className='flex justify-end pt-4'>
            <Button
              onClick={() => setOpen(false)}
              className='bg-blue-500 text-white hover:bg-blue-600'
            >
              Fechar
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
