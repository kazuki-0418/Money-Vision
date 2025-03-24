// src/components/ui/modal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import type React from "react";
import { IoClose } from "react-icons/io5";
import { cn } from "../../lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-auto p-6",
            className,
          )}
        >
          {title && (
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-full p-1 hover:bg-gray-100" aria-label="Close">
                  <IoClose className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
          )}
          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
