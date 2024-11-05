import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DialogShowContactProps } from '@/types/DialoShowCntactProps';

const DialogShowContact = ({ children, contact }: DialogShowContactProps) => {
    return (
        <Dialog >
            <DialogTrigger asChild dir="rtl">
                {children}
            </DialogTrigger>
            <DialogContent className="text-center">
                <DialogHeader>
                    <DialogTitle>المحتوى</DialogTitle>
                </DialogHeader>
                <div>
                    {contact}
                </div>

            </DialogContent>
        </Dialog>
    );
}

export default DialogShowContact;