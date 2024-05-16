import { CheckIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@nextui-org/react';
import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';
import {
  RequestMethods,
  productCategoriesKey,
  useMutateProductCategory,
} from '../app/hooks';
import { ModalCrudContext } from './TableCrudModal';

type ProductCategoryInputs = {
  name: string;
};

export interface IProductCategoryFormProps {
  isUpdate?: boolean;
}

export function ProductCategoryForm({ isUpdate }: IProductCategoryFormProps) {
  const { isOpen, onClose, item } = useContext(ModalCrudContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductCategoryInputs>();
  const { t } = useTranslation();
  const { isMutating, trigger } = useMutateProductCategory<string>(
    isUpdate ? RequestMethods.PATCH : RequestMethods.POST
  );

  const onSubmit: SubmitHandler<ProductCategoryInputs> = async (data) => {
    await trigger({ body: JSON.stringify({ ...data, id: item?.id }) });
    await mutate(productCategoriesKey);

    if (isOpen) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <Input
        {...register('name')}
        defaultValue={isUpdate ? item?.name : ''}
        type="text"
        label={t('categories.form.labels.name')}
      />
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
