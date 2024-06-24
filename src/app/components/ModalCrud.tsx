import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import {
  Children,
  FC,
  JSXElementConstructor,
  PropsWithChildren,
  ReactElement,
  ReactPortal,
  createContext,
  isValidElement,
  useContext,
} from 'react';
import { AppModel, AppModels } from '../types';

export type ModalContextType<T extends AppModels> = {
  isOpen: boolean;
  onClose: () => void;
  item?: AppModel<T>;
};
export const ModalCrudContext = createContext<ModalContextType<AppModels>>({
  isOpen: false,
  onClose: () => undefined,
  item: undefined,
});
export interface ITableCrudModalProps<T> extends PropsWithChildren {
  item?: T;
  isOpen: boolean;
  onOpenChange: () => void;
}

const ModalCrudHeader: FC<PropsWithChildren<{ title?: string }>> = ({
  children,
  title,
}) => {
  if (children) {
    return children;
  }

  return <h1 className="uppercase">{title}</h1>;
};

const ModalCrudFooter: FC<{
  cancelAction?: () => void;
  cancelButtonText?: string;
  okAction?: () => void;
  okButtonText?: string;
}> = ({ cancelAction, cancelButtonText, okAction, okButtonText }) => {
  const { onClose } = useContext(ModalCrudContext);

  return (
    <div className="flex justify-end w-full">
      <div>
        {!!cancelButtonText && (
          <Button
            variant="solid"
            color="default"
            aria-label="cancel and close modal"
            onPress={() => {
              cancelAction?.();
              onClose();
            }}
            endContent={<XMarkIcon className="w-6" />}
            className="mr-4 capitalize"
          >
            {cancelButtonText}
          </Button>
        )}
      </div>
      <div>
        {!!okButtonText && (
          <Button
            variant="solid"
            color="success"
            aria-label="ok and close modal"
            onPress={async () => {
              await okAction?.();
              await onClose();
            }}
            endContent={<CheckIcon className="w-6" />}
            className="capitalize"
          >
            {okButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export function ModalCrud<T extends AppModels>({
  item,
  isOpen,
  onOpenChange,
  children,
}: ITableCrudModalProps<T>) {
  let header:
    | ReactPortal
    | ReactElement<unknown, string | JSXElementConstructor<any>>;
  let footer:
    | ReactPortal
    | ReactElement<unknown, string | JSXElementConstructor<any>>;
  let content: (
    | ReactPortal
    | ReactElement<unknown, string | JSXElementConstructor<any>>
  )[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === ModalCrudHeader) {
      header = child;
    } else if (child.type === ModalCrudFooter) {
      footer = child;
    } else {
      content.push(child);
    }
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <ModalCrudContext.Provider value={{ isOpen, onClose, item }}>
            {!!header && <ModalHeader>{header}</ModalHeader>}
            <ModalBody className="p-4">
              <div className="flex">{content}</div>
            </ModalBody>
            {!!footer && <ModalFooter>{footer}</ModalFooter>}
          </ModalCrudContext.Provider>
        )}
      </ModalContent>
    </Modal>
  );
}

ModalCrud.Header = ModalCrudHeader;
ModalCrud.Footer = ModalCrudFooter;
