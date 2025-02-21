import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useContext } from 'react';
import { ThemeContext } from '@contexts/ThemeContext';

type TBaseModalProps = {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function BaseModal({
  children,
  open,
  setOpen,
}: TBaseModalProps) {
  const { theme, themeColor } = useContext(ThemeContext)!;
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className={`${theme} ${themeColor} relative flex transform flex-col space-y-6 overflow-hidden rounded-lg bg-themedFg px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-6 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95`}
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
