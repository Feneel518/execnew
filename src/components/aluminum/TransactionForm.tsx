"use client";
import { FC, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { AluminumTransactionCreationRequest } from "@/lib/Validators/AllAluminumValidators";
import TransitionSelect from "./TransitionSelect";
import TransitionCombo from "./TransitionCombo";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { TransactionType } from "@/lib/types";
import Loading from "../Global/Loading";
import ObjectID from "bson-objectid";
import { useGetCastingsForSelect } from "@/data/get-castings-for-select";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useGetDocketNumberForSelect } from "@/data/get-docket-number-for-select";
import { ALUMINUMTYPE } from "@prisma/client";
import { toast } from "../ui/use-toast";
import {
  deleteTransaction,
  upserAluminumTransaction,
} from "@/lib/aluminumQueries";

interface TransactionFormProps {
  supplier: {
    name: string;
    id: string;
    type: "SUPPLIER" | "USER" | "BOTH";
  }[];
  transaction?: TransactionType;
}

const TransactionForm: FC<TransactionFormProps> = ({
  supplier,
  transaction,
}) => {
  const router = useRouter();
  const queries = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    transaction?.docketDate ? transaction.docketDate : new Date()
  );
  const [deletingTransaction, setDeletingTransaction] = useState(false);

  const [suppId, setSuppId] = useState<string | undefined>(undefined);

  const form = useForm<AluminumTransactionCreationRequest>({
    defaultValues: {
      id: transaction?.id ? transaction.id : ObjectID().toString(),
      aluminumType: transaction?.aluminumType
        ? transaction.aluminumType
        : undefined,
      docketDate: transaction?.docketDate ? transaction.docketDate : new Date(),
      docketNumber: transaction?.docketNumber ? transaction.docketNumber : "",
      inwardType: transaction?.inwardType ? transaction.inwardType : undefined,
      price: transaction?.price ? transaction.price : 0,
      quantity: transaction?.quantity ? transaction.quantity : 0,
      quantityType: transaction?.quantityType ? transaction.quantityType : "",
      status: transaction?.status ? transaction.status : undefined,
      supplierId: transaction?.supplierId ? transaction.supplierId : undefined,
      userId: transaction?.userId ? transaction.userId : undefined,
      weight: transaction?.weight ? transaction.weight : undefined,
      TransactionCalculation:
        transaction?.TransactionCalculation &&
        transaction.TransactionCalculation.length > 0
          ? transaction.TransactionCalculation.map((trans) => {
              return {
                id: trans.id,
                index: trans.index,
                quantity: trans.quantity ?? undefined,
                quantityType: trans.quantityType ?? undefined,
                weight: trans.weight ?? undefined,
              };
            })
          : [],
      Castings:
        transaction?.CastingForTransaction &&
        transaction.CastingForTransaction.length > 0
          ? transaction.CastingForTransaction.map((trans) => {
              return {
                id: trans.id,
                castingId: trans.castingsId,
                description: trans.description ?? "",
                quantity: trans.quantity ?? undefined,
                weight: trans.weight ?? undefined,
              };
            })
          : [],
    },
  });

  const {
    append: weightAppend,
    fields: weightFields,
    remove: weighTRemove,
  } = useFieldArray<AluminumTransactionCreationRequest>({
    name: "TransactionCalculation",
    control: form.control,
  });
  const {
    append: productAppend,
    fields: productFields,
    remove: productRemove,
  } = useFieldArray<AluminumTransactionCreationRequest>({
    name: "Castings",
    control: form.control,
  });

  const status = form.watch("status");
  const inwardType = form.watch("inwardType");
  const aluminumType = form.watch("aluminumType");
  const weightCalculations = form.watch("TransactionCalculation");
  const weightCastingCalculations = form.watch("Castings");
  const supplierId = form.watch("supplierId");

  useEffect(() => {
    if (inwardType === "CASTING" || inwardType === "REJECT_CASTING") {
      productAppend({
        id: ObjectID().toString(),
        castingId: "",
        description: "",
        quantity: 0,
        weight: 0,
        quantityType: "Nos.",
      });
    }
  }, [inwardType === "CASTING", inwardType === "REJECT_CASTING"]);

  if (
    weightCalculations &&
    weightCalculations.length > 0 &&
    inwardType !== "CASTING" &&
    inwardType !== "REJECT_CASTING"
  ) {
    const totalWeight = weightCalculations.reduce((acc, total) => {
      return acc + Number(total.weight);
    }, 0);

    const totalQuantity = weightCalculations.reduce((acc, total) => {
      return acc + Number(total.quantity);
    }, 0);
    form.setValue("weight", totalWeight);
    form.setValue("quantity", totalQuantity);
  }

  if (
    weightCastingCalculations &&
    weightCastingCalculations.length > 0 &&
    (inwardType === "CASTING" || inwardType === "REJECT_CASTING")
  ) {
    const totalWeight = weightCastingCalculations.reduce((acc, total) => {
      return acc + Number(total.weight);
    }, 0);
    const totalQuantity = weightCastingCalculations.reduce((acc, total) => {
      return acc + Number(total.quantity);
    }, 0);
    form.setValue("weight", totalWeight);
    form.setValue("quantity", totalQuantity);
  }

  const fetch =
    (inwardType === "REPLACE_ALUMINUM" ||
      inwardType === "RETURNABLE" ||
      status === "OUT" ||
      inwardType === "RETURN_ALUMINUM_FROM_USER") &&
    suppId
      ? true
      : false;

  useEffect(() => {
    setSuppId(supplierId);
    queries.invalidateQueries({
      queryKey: ["docketForSelect"],
      refetchType: "all",
    });
  }, [supplierId]);
  const fetchProducts =
    inwardType === "CASTING" || inwardType === "REJECT_CASTING";

  const { data: docketNumbers } = useGetDocketNumberForSelect(suppId, fetch);
  const { data: products } = useGetCastingsForSelect(fetchProducts);

  const onSubmit = async (values: AluminumTransactionCreationRequest) => {
    if (
      inwardType !== "CASTING" &&
      inwardType !== "REJECT_CASTING" &&
      inwardType !== "RETURN_ALUMINUM_FROM_USER" &&
      !values.supplierId
    ) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Please Select Supplier to submit the form.",
      });
    }
    if (inwardType !== "CASTING" && !values.docketNumber) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description:
          "Please Select Docket Number or enter Docket Number to submit the form.",
      });
    }
    if (inwardType !== "CASTING" && inwardType !== "REJECT_CASTING") {
      values.Castings = [];
    }
    if (fetch && docketNumbers?.success) {
      const alType = docketNumbers?.success.find(
        (el) => el.docketNumber === values.docketNumber
      )?.type;
      values.aluminumType = alType as ALUMINUMTYPE;
    }
    if (inwardType === "CASTING" || inwardType === "REJECT_CASTING") {
      values.supplierId = values.userId!;
    }
    values.docketDate = date;
    values.quantityType = values.aluminumType === "SCRAP" ? "Bags" : "Ingot";
    values.weight === Number(values.weight);

    setIsLoading(true);
    const response = await upserAluminumTransaction(values);

    if (response?.success) {
      toast({
        title: "Your Transacrion has been saved.",
      });

      setIsLoading(false);

      router.push("/aluminum/transactions");
      router.refresh();
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not save your transaction",
      });
      setIsLoading(false);
    }
  };

  const handleTransaction = async () => {
    setDeletingTransaction(true);
    if (!transaction?.id) return;
    const response = await deleteTransaction(transaction?.id);
    setDeletingTransaction(false);
    if (response?.success) {
      router.push("/aluminum/transactions");
      router.refresh();
      return toast({
        title: "Your Transaction has been deleted.",
        duration: 1000,
      });
    }
    if (response?.error) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not delete your transaction",
        duration: 1000,
      });
    }
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
          <CardDescription>
            Lets create a transaction for the aluminum inward and outward. You
            can edit this transaction later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* STATUS */}
              <TransitionSelect
                control={form.control}
                isLoading={isLoading}
                label="Status of Transaction"
                name="status"
                select={[
                  {
                    id: "In",
                    value: "IN",
                  },
                  { id: "Out", value: "OUT" },
                ]}
                placeholder="Select inward or outward"
              ></TransitionSelect>
              {/* STATUS */}

              {/* INWARDTYPE */}
              {status === "IN" && (
                <TransitionSelect
                  control={form.control}
                  isLoading={isLoading}
                  label="Type of Inward"
                  name="inwardType"
                  select={[
                    {
                      id: "Aluminum",
                      value: "ALUMINUM",
                    },
                    {
                      id: "Casting",
                      value: "CASTING",
                    },
                    {
                      id: "Returnable",
                      value: "RETURNABLE",
                    },
                    {
                      id: "Replace Aluminum",
                      value: "REPLACE_ALUMINUM",
                    },
                    {
                      id: "Losses",
                      value: "LOSSES",
                    },
                    {
                      id: "Reject Casting",
                      value: "REJECT_CASTING",
                    },
                    {
                      id: "Return Aluminum From User",
                      value: "RETURN_ALUMINUM_FROM_USER",
                    },
                  ]}
                  placeholder="Select type of inward"
                ></TransitionSelect>
              )}
              {/* INWARDTYPE */}

              {/* ALUMINUMTYPE */}
              {inwardType === "ALUMINUM" && status !== "OUT" && (
                <TransitionSelect
                  control={form.control}
                  isLoading={isLoading}
                  label="Type of Inward"
                  name="aluminumType"
                  select={[
                    {
                      id: "Scrap",
                      value: "SCRAP",
                    },
                    {
                      id: "Ingot",
                      value: "INGOT",
                    },
                    {
                      id: "Pressure",
                      value: "PRESSURE",
                    },
                    {
                      id: "Gravity",
                      value: "GRAVITY",
                    },
                  ]}
                  placeholder="Select type of inward"
                ></TransitionSelect>
              )}
              {/* ALUMINUMTYPE */}
              {(!docketNumbers?.success ||
                docketNumbers.error ||
                docketNumbers.success.length === 0) &&
                suppId &&
                fetch && (
                  <div className="text-red-500">
                    There's no stock of this supplier, please select a different
                    supplier
                  </div>
                )}
              {/* Common Fields */}
              {status && (
                <>
                  <div
                    className={`grid ${
                      inwardType === "ALUMINUM" || inwardType === "RETURNABLE"
                        ? "grid-cols-3"
                        : "grid-cols-2"
                    }  gap-4`}
                  >
                    {/* SUPPLIER */}

                    <TransitionCombo
                      setValue={form.setValue}
                      title={
                        inwardType === "CASTING" ||
                        inwardType === "REJECT_CASTING"
                          ? "Supplier Or User"
                          : "Supplier"
                      }
                      control={form.control}
                      isLoading={isLoading}
                      label="Type of Inward"
                      name={
                        inwardType === "CASTING" ||
                        inwardType === "REJECT_CASTING"
                          ? "userId"
                          : "supplierId"
                      }
                      select={
                        inwardType !== "CASTING" &&
                        inwardType !== "REJECT_CASTING"
                          ? supplier
                              .filter((supp) => supp.type !== "USER")
                              .map((supp) => {
                                return {
                                  id: supp.id,
                                  value: supp.name,
                                };
                              })
                          : supplier.map((supp) => {
                              return {
                                id: supp.id,
                                value: `${supp.name} | ${supp.type}`,
                              };
                            })
                      }
                      placeholder="Select type of inward"
                    ></TransitionCombo>

                    {/* SUPPLIER */}

                    {/* USER */}
                    {(inwardType === "RETURNABLE" ||
                      status === "OUT" ||
                      inwardType === "RETURN_ALUMINUM_FROM_USER") && (
                      <TransitionCombo
                        setValue={form.setValue}
                        title="User"
                        control={form.control}
                        isLoading={isLoading}
                        label="User"
                        name="userId"
                        select={supplier
                          .filter((supp) => supp.type !== "SUPPLIER")
                          .map((supp) => {
                            return {
                              id: supp.id,
                              value: supp.name,
                            };
                          })}
                        placeholder="Select user"
                      ></TransitionCombo>
                    )}
                    {/* USER */}

                    {/* DOCKETNUMBER */}
                    {fetch &&
                    docketNumbers?.success &&
                    docketNumbers.success.length > 0 ? (
                      <TransitionCombo
                        setValue={form.setValue}
                        title="Docket Number"
                        control={form.control}
                        isLoading={isLoading}
                        label="Docket Number"
                        name="docketNumber"
                        select={docketNumbers?.success?.map((supp) => {
                          return {
                            id: supp.docketNumber,
                            value: `${supp.docketNumber} | ${supp.type}`,
                          };
                        })}
                        placeholder="Select user"
                      ></TransitionCombo>
                    ) : null}

                    {status === "IN" &&
                      (inwardType === "ALUMINUM" ||
                        inwardType === "CASTING") && (
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name="docketNumber"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Docket Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Docket Number"
                                  {...field}
                                ></Input>
                              </FormControl>
                              <FormMessage></FormMessage>
                            </FormItem>
                          )}
                        ></FormField>
                      )}
                    {/* DOCKETNUMBER */}

                    {/* DOCKETDATE */}
                    {inwardType === "ALUMINUM" && (
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="docketDate"
                        render={({ field }) => (
                          <FormItem className="flex-1 ">
                            <FormLabel>Docket Date</FormLabel>
                            <FormControl>
                              <div className="">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {date ? (
                                        format(date, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                    <div className="rounded-md border w-full">
                                      <Calendar
                                        className=""
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                      />
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </FormControl>
                            <FormMessage></FormMessage>
                          </FormItem>
                        )}
                      ></FormField>
                    )}
                    {/* DOCKETDATE */}

                    {/* WEIGHT */}
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="weight"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex-1">
                            <FormLabel>Weight </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Weight"
                                {...field}
                                type="number"
                              ></Input>
                            </FormControl>
                            <FormMessage></FormMessage>
                          </FormItem>
                        );
                      }}
                    ></FormField>
                    {/* WEIGHT */}

                    {/* QUANTITY */}
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Quantity"
                              {...field}
                              type="number"
                            ></Input>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>
                    {/* QUANTITY */}

                    {/* PRICE */}
                    {inwardType === "ALUMINUM" && (
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Price"
                                {...field}
                                type="number"
                              ></Input>
                            </FormControl>
                            <FormMessage></FormMessage>
                          </FormItem>
                        )}
                      ></FormField>
                    )}
                    {/* PRICE */}
                  </div>
                </>
              )}

              {/* SUBMITBUTTON */}
              {status && (
                <>
                  {inwardType === "CASTING" || inwardType === "REJECT_CASTING"
                    ? productFields.map((fields, index) => {
                        return (
                          <div
                            className="flex items-end col-span-3 gap-2"
                            key={fields.id}
                          >
                            {products?.success &&
                              products?.success.length > 0 && (
                                <TransitionCombo
                                  setValue={form.setValue}
                                  title="Casting"
                                  control={form.control}
                                  isLoading={isLoading}
                                  label="Type of Inward"
                                  name={`Castings.${index}.castingId`}
                                  select={products.success.map((supp) => {
                                    return {
                                      id: supp.id,
                                      value: supp.name,
                                    };
                                  })}
                                ></TransitionCombo>
                              )}
                            <FormField
                              disabled={isLoading}
                              control={form.control}
                              name={`Castings.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  {index === 0 && (
                                    <FormLabel>Description</FormLabel>
                                  )}
                                  <FormControl>
                                    <Input
                                      placeholder="Description"
                                      {...field}
                                    ></Input>
                                  </FormControl>
                                  <FormMessage></FormMessage>
                                </FormItem>
                              )}
                            ></FormField>
                            <FormField
                              disabled={isLoading}
                              control={form.control}
                              name={`Castings.${index}.weight`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  {index === 0 && <FormLabel>Weight</FormLabel>}
                                  <FormControl>
                                    <Input
                                      placeholder="Weight"
                                      type="number"
                                      {...field}
                                    ></Input>
                                  </FormControl>
                                  <FormMessage></FormMessage>
                                </FormItem>
                              )}
                            ></FormField>
                            <FormField
                              disabled={isLoading}
                              control={form.control}
                              name={`Castings.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  {index === 0 && (
                                    <FormLabel>Quantity</FormLabel>
                                  )}
                                  <FormControl>
                                    <Input
                                      placeholder="Quantity"
                                      type="number"
                                      {...field}
                                    ></Input>
                                  </FormControl>
                                  <FormMessage></FormMessage>
                                </FormItem>
                              )}
                            ></FormField>
                            {productFields.length - 1 === index && (
                              <Button
                                type="button"
                                onClick={() =>
                                  productAppend({
                                    id: ObjectID().toString(),
                                    castingId: "",
                                    description: "",
                                    quantity: 0,
                                    weight: 0,
                                    quantityType: "Nos.",
                                  })
                                }
                              >
                                +
                              </Button>
                            )}
                            {index !== 0 && (
                              <Button
                                type="button"
                                onClick={() => productRemove(index)}
                              >
                                -
                              </Button>
                            )}
                          </div>
                        );
                      })
                    : null}
                  {/* Weight Calculation */}
                  {inwardType !== "CASTING" &&
                    inwardType !== "REJECT_CASTING" &&
                    weightFields.length == 0 && (
                      <Button
                        type="button"
                        className="mt-10 w-80 mx-auto"
                        onClick={() =>
                          weightAppend({
                            id: ObjectID().toString(),
                            index: 0,
                            weight: 0,
                            quantity: 0,
                            quantityType:
                              aluminumType === "SCRAP" ? "Bags" : "Ingot",
                          })
                        }
                      >
                        open Weight Calculator
                      </Button>
                    )}
                  {weightFields.length > 0 && (
                    <CardTitle className="mt-10">Weight Calculator</CardTitle>
                  )}
                  {weightFields.map((field, index) => {
                    return (
                      <div className="" key={field.id}>
                        <div className="flex md:flex-row gap-4 items-end">
                          <FormField
                            disabled={isLoading}
                            control={form.control}
                            name={`TransactionCalculation.${index}.weight`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                {index === 0 && <FormLabel>Weight</FormLabel>}
                                <FormControl>
                                  <Input
                                    placeholder="Weight"
                                    type="number"
                                    {...field}
                                  ></Input>
                                </FormControl>
                                <FormMessage></FormMessage>
                              </FormItem>
                            )}
                          ></FormField>
                          <FormField
                            disabled={isLoading}
                            control={form.control}
                            name={`TransactionCalculation.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                {index === 0 && <FormLabel>Quantity</FormLabel>}
                                <FormControl>
                                  <Input
                                    placeholder="Quantity"
                                    type="number"
                                    {...field}
                                  ></Input>
                                </FormControl>
                                <FormMessage></FormMessage>
                              </FormItem>
                            )}
                          ></FormField>
                          {weightFields.length - 1 === index && (
                            <Button
                              type="button"
                              onClick={() =>
                                weightAppend({
                                  id: ObjectID().toString(),
                                  index: index,
                                  weight: 0,
                                  quantity: 0,
                                  quantityType:
                                    aluminumType === "SCRAP" ? "Bags" : "Slabs",
                                })
                              }
                            >
                              +
                            </Button>
                          )}
                          <Button
                            type="button"
                            onClick={() => weighTRemove(index)}
                          >
                            -
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {/* Weight Calculation */}
                  <Button
                    type="submit"
                    className="bg-exec hover:bg-exec/90"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loading /> : "Save Transaction Information"}
                  </Button>
                </>
              )}
              {/* SUBMITBUTTON */}
            </form>
          </Form>

          {transaction?.id && (
            <>
              <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                <div className="">
                  <div className="">Danger Zone</div>
                </div>
                <div className="text-muted-foreground">
                  Deleting your category cannot be undone. This will also make
                  the inventory
                </div>
                <AlertDialogTrigger
                  disabled={isLoading || deletingTransaction}
                  className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
                >
                  {deletingTransaction ? "Deleting..." : "Delete Transaction"}
                </AlertDialogTrigger>
              </div>
            </>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the
                Quotation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingTransaction}
                className="bg-destructive hover:bg-destructive"
                onClick={handleTransaction}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default TransactionForm;
