import { CheckIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Switch,
  Textarea,
} from '@nextui-org/react';
import { HTMLInputTypeAttribute, useContext } from 'react';
import {
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
  useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AppEntities, AppEntity } from '../types';
import { ModalContextType, ModalCrudContext } from './TableCrudModal';

export type OnSubmitCreateOrUpdateFn<T, U extends AppEntities> = ({
  data,
  item,
  isOpen,
  onClose,
}: {
  data: T;
  item?: AppEntity<U>;
  isOpen: Boolean;
  onClose: () => void;
}) => Promise<void>;
export type CrudFormInputs<T, U extends AppEntities> = {
  inputName: Path<T>;
  defaultValue: (
    item?: AppEntity<U>,
    isUpdate?: boolean
  ) => string | boolean | AppEntity<U>;
  inputType: HTMLInputTypeAttribute;
  componentType:
    | 'input'
    | 'textarea'
    | 'autocomplete'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'switch';
  label: string;
  cssClasses?: string;
  options?: RegisterOptions;
  collectionItems?: Array<Record<'value' | 'label', string>>;
  defaultSelectedKey?: (item?: AppEntity<U>) => string | undefined;
  defaultInputValue?: (item?: AppEntity<U>) => string | undefined;
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
    useContext<ModalContextType<U>>(ModalCrudContext);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<T>();

  console.log(watch());

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onFormSubmit({ data, isOpen, onClose, item })
      )}
      className="flex flex-col w-full"
    >
      {formInputs?.map((input, index) => {
        if (input.componentType === 'switch') {
          return (
            <Controller
              key={index}
              control={control}
              name={input.inputName}
              render={({ field }) => (
                <Switch
                  defaultSelected={!!input.defaultValue(item, isUpdate)}
                  {...field}
                  className={input.cssClasses}
                >
                  {input.label}
                </Switch>
              )}
            />
          );
        }

        if (input.componentType === 'textarea') {
          return (
            <Textarea
              key={index}
              {...register(input.inputName, { ...input.options })}
              defaultValue={`${input.defaultValue(item, isUpdate)}`}
              label={input.label}
              className={input.cssClasses}
              isRequired={!!input?.options?.required}
            />
          );
        }

        if (input.componentType === 'autocomplete') {
          return (
            <Autocomplete
              key={index}
              {...register(input.inputName, { ...input.options })}
              label={input.label}
              className={input.cssClasses}
              isRequired={!!input?.options?.required}
              defaultItems={input.collectionItems}
              defaultSelectedKey={input?.defaultSelectedKey?.(item)}
              defaultInputValue={input?.defaultInputValue?.(item)}
            >
              {(item) => (
                <AutocompleteItem key={item.value} className="capitalize">
                  {item.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
          );
        }

        return (
          <Input
            key={index}
            {...register(input.inputName, { ...input.options })}
            defaultValue={`${input.defaultValue(item, isUpdate)}`}
            type={input.inputType}
            label={input.label}
            className={input.cssClasses}
            isRequired={!!input?.options?.required}
          />
        );
      })}
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
