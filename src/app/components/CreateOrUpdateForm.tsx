import { CheckIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@nextui-org/react';
import { HTMLInputTypeAttribute, useContext } from 'react';
import { FieldValues, Path, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppEntities } from '../models';
import { ModalContextType, ModalCrudContext } from './TableCrudModal';

export type OnSubmitCreateOrUpdateFn<T, U extends AppEntities> = ({
  data,
  item,
  isOpen,
  onClose,
}: {
  data: T;
  item: U;
  isOpen: Boolean;
  onClose: () => void;
}) => Promise<void>;
export type CrudFormInputs<T, U> = {
  inputName: Path<T>;
  defaultValue: (item: U, isUpdate?: boolean) => string;
  type: HTMLInputTypeAttribute;
  label: string;
  cssClasses?: string;
}[];

export interface ICreateOrUpdateFormProps<
  T extends FieldValues,
  U extends AppEntities
> {
  isUpdate?: boolean;
  isMutating: boolean;
  onFormSubmit: OnSubmitCreateOrUpdateFn<T, U>;
  formInputs: CrudFormInputs<T, U>;
}

export function CreateOrUpdateForm<
  T extends FieldValues,
  U extends AppEntities
>({
  isUpdate,
  onFormSubmit,
  isMutating,
  formInputs,
}: ICreateOrUpdateFormProps<T, U>) {
  const { t } = useTranslation();
  const { isOpen, onClose, item } =
    useContext<ModalContextType<T>>(ModalCrudContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>();

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onFormSubmit({ data, isOpen, onClose, item })
      )}
      className="flex flex-col w-full"
    >
      {formInputs?.map((input, index) => (
        <Input
          key={index}
          {...register(input.inputName)}
          defaultValue={input.defaultValue(item, isUpdate)}
          type={input.type}
          label={input.label}
          className={input.cssClasses}
        />
      ))}
      <div className="flex justify-end py-4">
        <Button
          variant="solid"
          color="success"
          aria-label="create product category"
          type="submit"
          disabled={isMutating}
          endContent={
            isUpdate ? (
              <CheckIcon className="w-6" />
            ) : (
              <PlusCircleIcon className="w-6" />
            )
          }
          className="capitalize"
        >
          {isUpdate
            ? t('categories.form.buttons.update')
            : t('categories.form.buttons.create')}
        </Button>
      </div>
    </form>
  );
}
