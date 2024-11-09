import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuotationCreationRequest } from "@/lib/Validators/QuotationValidator";
import { FC } from "react";
import {
  Control,
  FieldValue,
  FieldValues,
  SetFieldValue,
  useFieldArray,
  UseFormSetValue,
} from "react-hook-form";

interface QuotationComponentsProps {
  nestIndex: number;
  control: Control<QuotationCreationRequest>;
  setId: UseFormSetValue<QuotationCreationRequest>;
}

const QuotationComponents: FC<QuotationComponentsProps> = ({
  nestIndex,
  control,
  setId,
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `items.${nestIndex}.components`,
  });
  return (
    <div>
      {fields.map((field, index) => {
        setId(`items.${nestIndex}.components.${index}.compId`, field.compId);
        return (
          <div key={field.id} className="flex items-end gap-4">
            <FormField
              control={control}
              name={`items.${nestIndex}.components.${index}.items`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Components</FormLabel>
                  <FormControl>
                    <Input placeholder="Price" {...field}></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  append({
                    items: "",
                  });
                }}
              >
                Add Components
              </Button>

              <Button onClick={() => remove(index)} type="button">
                -
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuotationComponents;
