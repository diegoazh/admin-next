import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { createContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppEntities, ProductCategoryEntity } from '../app/models';

export const ModalCrudContext = createContext<{
  isOpen: boolean;
  onClose: () => void;
  item?: ProductCategoryEntity;
}>({
  isOpen: false,
  onClose: () => undefined,
  item: undefined,
});
export interface ITableCrudModalProps<T> {
  entityName: string;
  item?: T;
  isOpen: boolean;
  modalContent: React.ReactNode;
  showFooter?: boolean;
  showModalCancelButton: boolean;
  modalCancelButtonText: string;
  onModalCancelAction: () => void;
  showModalOkButton: boolean;
  modalOkButtonText: string;
  onModalOkAction: () => void | Promise<void>;
  modalType?: 'show' | 'create' | 'update' | 'delete';
  onOpenChange: () => void;
}

export function TableCrudModal<T extends AppEntities>({
  entityName,
  item,
  isOpen,
  modalContent,
  showFooter = true,
  showModalCancelButton,
  modalCancelButtonText,
  onModalCancelAction,
  showModalOkButton,
  modalOkButtonText,
  onModalOkAction,
  modalType,
  onOpenChange,
}: ITableCrudModalProps<T>) {
  const { t } = useTranslation();

  function defineTitleKey(
    modalType: 'show' | 'create' | 'update' | 'delete'
  ): string {
    return modalType === 'show'
      ? 'categories.modals.showTitle'
      : modalType === 'create'
      ? 'categories.modals.createTitle'
      : modalType === 'update'
      ? 'categories.modals.updateTitle'
      : 'categories.modals.deleteTitle';
  }

  if (!modalType) return;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h1 className="uppercase">
                {t(defineTitleKey(modalType), {
                  entityName,
                  itemName: (item as any)?.['name'],
                })}
              </h1>
            </ModalHeader>
            <ModalBody className="p-4">
              <ModalCrudContext.Provider value={{ isOpen, onClose, item }}>
                <div className="flex">{modalContent}</div>
              </ModalCrudContext.Provider>
            </ModalBody>
            {showFooter && (
              <ModalFooter>
                <div className="flex justify-end w-full">
                  <div>
                    {showModalCancelButton && (
                      <Button
                        variant="solid"
                        color="default"
                        aria-label="cancel and close modal"
                        onPress={() => {
                          onModalCancelAction();
                          onClose();
                        }}
                        endContent={<XMarkIcon className="w-6" />}
                        className="mr-4 capitalize"
                      >
                        {modalCancelButtonText}
                      </Button>
                    )}
                  </div>
                  <div>
                    {showModalOkButton && (
                      <Button
                        variant="solid"
                        color="success"
                        aria-label="ok and close modal"
                        onPress={async () => {
                          await onModalOkAction();
                          await onClose();
                        }}
                        endContent={<CheckIcon className="w-6" />}
                        className="capitalize"
                      >
                        {modalOkButtonText}
                      </Button>
                    )}
                  </div>
                </div>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
