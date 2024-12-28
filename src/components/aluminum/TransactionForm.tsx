// "use client";

// import { FC, useCallback, useEffect, useState } from "react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "../ui/alert-dialog";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../ui/form";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Button } from "../ui/button";
// import { cn } from "@/lib/utils";
// import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "../ui/command";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Input } from "../ui/input";
// import { useFieldArray, useForm } from "react-hook-form";
// import Loading from "../Global/Loading";
// import { addDays, format } from "date-fns";
// import { Calendar } from "../ui/calendar";
// import {
//   AluminumTransactionCreationRequest,
//   AluminumTransactionValidator,
// } from "@/lib/Validators/AllAluminumValidators";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "../ui/use-toast";
// import {
//   deleteTransaction,
//   upserAluminumTransaction,
// } from "@/lib/aluminumQueries";
// import ObjectID from "bson-objectid";
// import { useRouter } from "next/navigation";
// import { TransactionType } from "@/lib/types";
// import { useGetDocketNumberForSelect } from "@/data/get-docket-number-for-select";
// import { useGetCastingsForSelect } from "@/data/get-castings-for-select";
// import { useQueryClient } from "@tanstack/react-query";
// import { useGetStock } from "@/data/get-stock";
// import { useGetAluminumWeightBasedOnDocket } from "@/data/get-aluminum-weight-with-docket-number";

// interface TransactionFormProps {
//   supplier: {
//     name: string;
//     id: string;
//     type: "SUPPLIER" | "USER" | "BOTH";
//   }[];
//   transaction?: TransactionType;
// }

// const TransactionForm: FC<TransactionFormProps> = ({
//   supplier,
//   transaction,
// }) => {
//   // router imports
//   const router = useRouter();
//   const queries = useQueryClient();

//   // states
//   const [date, setDate] = useState<Date | undefined>(
//     transaction?.docketDate ? transaction.docketDate : new Date()
//   );
//   const [isLoading, setIsLoading] = useState(false);
//   const [deletingTransaction, setDeletingTransaction] = useState(false);
//   const [suppId, setSuppId] = useState<string | undefined>(undefined);

//   // form default
//   const form = useForm<AluminumTransactionCreationRequest>({
//     resolver: zodResolver(AluminumTransactionValidator),
//     defaultValues: {
//       id: transaction?.id ? transaction.id : ObjectID().toString(),
//       aluminumType: transaction?.aluminumType
//         ? transaction.aluminumType
//         : undefined,
//       docketDate: transaction?.docketDate ? transaction.docketDate : new Date(),
//       docketNumber: transaction?.docketNumber ? transaction.docketNumber : "",
//       inwardType: transaction?.inwardType ? transaction.inwardType : undefined,
//       price: transaction?.price ? transaction.price : 0,
//       quantity: transaction?.quantity ? transaction.quantity : 0,
//       quantityType: transaction?.quantityType ? transaction.quantityType : "",
//       status: transaction?.status ? transaction.status : undefined,
//       supplierId: transaction?.supplierId ? transaction.supplierId : undefined,
//       userId: transaction?.userId ? transaction.userId : undefined,
//       weight: transaction?.weight ? transaction.weight : undefined,
//       TransactionCalculation:
//         transaction?.TransactionCalculation &&
//         transaction.TransactionCalculation.length > 0
//           ? transaction.TransactionCalculation.map((trans) => {
//               return {
//                 id: trans.id,
//                 index: trans.index,
//                 quantity: trans.quantity ?? undefined,
//                 quantityType: trans.quantityType ?? undefined,
//                 weight: trans.weight ?? undefined,
//               };
//             })
//           : [],
//       Castings:
//         transaction?.CastingForTransaction &&
//         transaction.CastingForTransaction.length > 0
//           ? transaction.CastingForTransaction.map((trans) => {
//               return {
//                 id: trans.id,
//                 castingId: trans.castingsId,
//                 description: trans.description ?? "",
//                 quantity: trans.quantity ?? undefined,
//                 weight: trans.weight ?? undefined,
//               };
//             })
//           : [
//               {
//                 castingId: ObjectID().toString(),
//                 id: ObjectID().toString(),
//                 description: "",
//                 quantity: 0,
//                 weight: 0,
//               },
//             ],
//     },
//   });

//   // dynamic data from form
//   const status = form.watch("status");
//   const inwardType = form.watch("inwardType");
//   const aluminumType = form.watch("aluminumType");
//   const weightCalculations = form.watch("TransactionCalculation");
//   const weightCastingCalculations = form.watch("Castings");
//   const supplierId = form.watch("supplierId");
//   const docketNumber = form.watch("docketNumber");

//   // form.setValue("weight", 120);

//   useEffect(() => {
//     setSuppId(supplierId);
//     queries.invalidateQueries({
//       queryKey: ["docketForSelect"],
//       refetchType: "all",
//     });
//   }, [supplierId]);

//   // use field arrays
//   const { append, fields, remove } = useFieldArray({
//     name: "TransactionCalculation",
//     control: form.control,
//   });
//   const {
//     append: ProductAppend,
//     fields: ProductFields,
//     remove: ProductRemove,
//   } = useFieldArray({
//     name: "Castings",
//     control: form.control,
//   });

//   // fetch datas
//   const fetch =
//     (inwardType === "REPLACE_ALUMINUM" ||
//       inwardType === "RETURNABLE" ||
//       status === "OUT") &&
//     suppId
//       ? true
//       : false;
//   const fetchProducts = inwardType === "CASTING";

//   const { data: docketNumbers } = useGetDocketNumberForSelect(suppId, fetch);
//   const { data: products } = useGetCastingsForSelect(fetchProducts);
//   const { data: stock } = useGetStock();
//   // const { data: docketWeight } = useGetAluminumWeightBasedOnDocket(
//   //   docketNumber,
//   //   suppId
//   // );

//   // total weight calculations
//   if (
//     weightCalculations &&
//     weightCalculations.length > 0 &&
//     inwardType !== "CASTING"
//   ) {
//     const totalWeight = weightCalculations.reduce((acc, total) => {
//       return acc + Number(total.weight);
//     }, 0);

//     const totalQuantity = weightCalculations.reduce((acc, total) => {
//       return acc + Number(total.quantity);
//     }, 0);
//     form.setValue("weight", totalWeight);
//     form.setValue("quantity", totalQuantity);
//   }
//   if (
//     weightCastingCalculations &&
//     weightCastingCalculations.length > 0 &&
//     inwardType === "CASTING"
//   ) {
//     const totalWeight = weightCastingCalculations.reduce((acc, total) => {
//       return acc + Number(total.weight);
//     }, 0);
//     const totalQuantity = weightCastingCalculations.reduce((acc, total) => {
//       return acc + Number(total.quantity);
//     }, 0);
//     form.setValue("weight", totalWeight);
//     form.setValue("quantity", totalQuantity);
//   }

//   // submitting
//   const handleSubmit = async (values: AluminumTransactionCreationRequest) => {
//     if (!values.supplierId) {
//       return toast({
//         variant: "destructive",
//         title: "Oppse!",
//         description: "Please Select Supplier to submit the form.",
//       });
//     }

//     values.docketDate = date;
//     values.quantityType = values.aluminumType === "SCRAP" ? "Bags" : "Slabs";

//     setIsLoading(true);

//     console.log(values);

//     const response = await upserAluminumTransaction(values);

//     if (response?.success) {
//       toast({
//         title: "Your Transacrion has been saved.",
//       });

//       setIsLoading(false);

//       router.push("/aluminum/transactions");
//       router.refresh();
//     }
//     if (response?.error) {
//       toast({
//         variant: "destructive",
//         title: "Oppse!",
//         description: "could not save your transaction",
//       });
//       setIsLoading(false);
//     }
//   };

//   // deleting
//   const handleTransaction = async () => {
//     setDeletingTransaction(true);
//     if (!transaction?.id) return;
//     const response = await deleteTransaction(transaction?.id);
//     setDeletingTransaction(false);
//     if (response?.success) {
//       router.push("/aluminum/transactions");
//       router.refresh();
//       return toast({
//         title: "Your Transaction has been deleted.",
//         duration: 1000,
//       });
//     }
//     if (response?.error) {
//       return toast({
//         variant: "destructive",
//         title: "Oppse!",
//         description: "could not delete your transaction",
//         duration: 1000,
//       });
//     }
//   };

//   return (
//     <AlertDialog>
//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle>Transaction Information</CardTitle>
//           <CardDescription>
//             Lets create a transaction for the aluminum inward and outward. You
//             can edit this transaction later.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSubmit)}
//               className="flex flex-col gap-4 "
//             >
//               <div className="">
//                 {/* In or out */}
//                 <FormField
//                   disabled={isLoading}
//                   control={form.control}
//                   name="status"
//                   render={({ field }) => (
//                     <FormItem className="flex-1">
//                       <FormLabel>Status of Transaction</FormLabel>
//                       <FormControl>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select inward or outward" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem key={"in"} value={"IN"}>
//                               <div className="flex items-center gap-4">
//                                 <span>{"IN"}</span>
//                               </div>
//                             </SelectItem>
//                             <SelectItem key={"out"} value={"OUT"}>
//                               <div className="flex items-center gap-4">
//                                 <span>{"OUT"}</span>
//                               </div>
//                             </SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage></FormMessage>
//                     </FormItem>
//                   )}
//                 ></FormField>
//               </div>

//               {/* Inward Type */}
//               {status === "IN" ? (
//                 <div className="">
//                   <FormField
//                     disabled={isLoading}
//                     control={form.control}
//                     name="inwardType"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormLabel>Type of Inward</FormLabel>
//                         <FormControl>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select type of inward" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem key={"Aluminum"} value={"ALUMINUM"}>
//                                 <div className="flex items-center gap-4">
//                                   <span>{"Aluminum"}</span>
//                                 </div>
//                               </SelectItem>
//                               <SelectItem key={"Casting"} value={"CASTING"}>
//                                 <div className="flex items-center gap-4">
//                                   <span>{"Casting"}</span>
//                                 </div>
//                               </SelectItem>
//                               <SelectItem
//                                 key={"Returnable"}
//                                 value={"RETURNABLE"}
//                               >
//                                 <div className="flex items-center gap-4">
//                                   <span>{"Returnable"}</span>
//                                 </div>
//                               </SelectItem>
//                               <SelectItem
//                                 key={"ReplaceAluminum"}
//                                 value={"REPLACE_ALUMINUM"}
//                               >
//                                 <div className="flex items-center gap-4">
//                                   <span>{"ReplaceAluminum"}</span>
//                                 </div>
//                               </SelectItem>
//                               <SelectItem key={"Losses"} value={"LOSSES"}>
//                                 <div className="flex items-center gap-4">
//                                   <span>{"Losses"}</span>
//                                 </div>
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormMessage></FormMessage>
//                       </FormItem>
//                     )}
//                   ></FormField>
//                 </div>
//               ) : status === "OUT" ? (
//                 <div className="flex flex-col gap-4">
//                   {stock?.success?.map((sto, index) => {
//                     return (
//                       <div className="flex border-b w-80 pb-2 " key={index}>
//                         <div className="w-40">{sto.aluminumType}</div>
//                         <div className="">{sto.netWeight} kgs</div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : null}

//               {inwardType === "ALUMINUM" && status !== "OUT" && (
//                 <div className="">
//                   {/* Aluminum Type */}
//                   <FormField
//                     disabled={isLoading}
//                     control={form.control}
//                     name="aluminumType"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormLabel>Type of Aluminum</FormLabel>
//                         <FormControl>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select type of aluminum" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem key={"Scrap"} value={"SCRAP"}>
//                                 <div className="flex items-center gap-4">
//                                   <span>{"Scrap"}</span>
//                                 </div>
//                               </SelectItem>
//                               <SelectItem key={"Gravity"} value={"GRAVITY"}>
//                                 <div className="flex items-center gap-4">
//                                   <span>{"Gravity"}</span>
//                                 </div>
//                               </SelectItem>
//                               <SelectItem key={"Pressure"} value={"PRESSURE"}>
//                                 <div className="flex items-center gap-4">
//                                   <span>{"Pressure"}</span>
//                                 </div>
//                               </SelectItem>
//                               <SelectItem key={"Ladi"} value={"LADI"}>
//                                 <div className="flex items-center gap-4">
//                                   <span>{"Ladi"}</span>
//                                 </div>
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormMessage></FormMessage>
//                       </FormItem>
//                     )}
//                   ></FormField>
//                 </div>
//               )}
//               {(inwardType || status === "OUT") && (
//                 <>
//                   <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-end">
//                     {supplier.length > 0 && (
//                       <FormField
//                         control={form.control}
//                         name="supplierId"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel>Supplier</FormLabel>
//                             <Popover>
//                               <PopoverTrigger asChild>
//                                 <FormControl>
//                                   <Button
//                                     variant="outline"
//                                     role="combobox"
//                                     className={cn(
//                                       "w-full justify-between",
//                                       !field.value && "text-muted-foreground"
//                                     )}
//                                   >
//                                     {field.value
//                                       ? field.value === "null"
//                                         ? "-----null-----"
//                                         : supplier.find(
//                                             (cust) => cust.id === field.value
//                                           )?.name
//                                       : "Select supplier"}
//                                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                   </Button>
//                                 </FormControl>
//                               </PopoverTrigger>
//                               <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
//                                 <Command>
//                                   <CommandInput placeholder="Search supplier..." />
//                                   <CommandList>
//                                     <CommandEmpty>
//                                       No supplier found.
//                                     </CommandEmpty>
//                                     <CommandGroup>
//                                       <CommandItem
//                                         onSelect={() => {
//                                           form.setValue("supplierId", "null");
//                                         }}
//                                         key={"null"}
//                                         value={"null"}
//                                       >
//                                         <div className="flex items-center gap-4">
//                                           <span>{"-----null-----"}</span>
//                                         </div>
//                                       </CommandItem>
//                                       {supplier
//                                         .filter((type) => type.type !== "USER")
//                                         .map((language) => (
//                                           <CommandItem
//                                             value={language.name}
//                                             key={language.id}
//                                             onSelect={() => {
//                                               form.setValue(
//                                                 "supplierId",
//                                                 language.id
//                                               );
//                                             }}
//                                           >
//                                             <Check
//                                               className={cn(
//                                                 "mr-2 h-4 w-4",
//                                                 language.name === field.value
//                                                   ? "opacity-100"
//                                                   : "opacity-0"
//                                               )}
//                                             />
//                                             {language.name}
//                                           </CommandItem>
//                                         ))}
//                                     </CommandGroup>
//                                   </CommandList>
//                                 </Command>
//                               </PopoverContent>
//                             </Popover>

//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     )}
//                     {supplier.length > 0 &&
//                       (inwardType === "RETURNABLE" || status === "OUT") && (
//                         <FormField
//                           control={form.control}
//                           name="userId"
//                           render={({ field }) => (
//                             <FormItem className="flex-1">
//                               <FormLabel>User</FormLabel>
//                               <Popover>
//                                 <PopoverTrigger asChild>
//                                   <FormControl>
//                                     <Button
//                                       variant="outline"
//                                       role="combobox"
//                                       className={cn(
//                                         "w-full justify-between",
//                                         !field.value && "text-muted-foreground"
//                                       )}
//                                     >
//                                       {field.value
//                                         ? field.value === "null"
//                                           ? "-----null-----"
//                                           : supplier.find(
//                                               (cust) => cust.id === field.value
//                                             )?.name
//                                         : "Select user"}
//                                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                     </Button>
//                                   </FormControl>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
//                                   <Command>
//                                     <CommandInput placeholder="Search user..." />
//                                     <CommandList>
//                                       <CommandEmpty>
//                                         No supplier found.
//                                       </CommandEmpty>
//                                       <CommandGroup>
//                                         <CommandItem
//                                           onSelect={() => {
//                                             form.setValue("userId", "null");
//                                           }}
//                                           key={"null"}
//                                           value={"null"}
//                                         >
//                                           <div className="flex items-center gap-4">
//                                             <span>{"-----null-----"}</span>
//                                           </div>
//                                         </CommandItem>
//                                         {supplier
//                                           .filter(
//                                             (type) => type.type !== "SUPPLIER"
//                                           )
//                                           .map((language) => (
//                                             <CommandItem
//                                               value={language.name}
//                                               key={language.id}
//                                               onSelect={() => {
//                                                 form.setValue(
//                                                   "userId",
//                                                   language.id
//                                                 );
//                                               }}
//                                             >
//                                               <Check
//                                                 className={cn(
//                                                   "mr-2 h-4 w-4",
//                                                   language.name === field.value
//                                                     ? "opacity-100"
//                                                     : "opacity-0"
//                                                 )}
//                                               />
//                                               {language.name}
//                                             </CommandItem>
//                                           ))}
//                                       </CommandGroup>
//                                     </CommandList>
//                                   </Command>
//                                 </PopoverContent>
//                               </Popover>

//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       )}
//                     {/* Products */}
//                     {fetch ? (
//                       docketNumbers &&
//                       docketNumbers.success &&
//                       docketNumbers.success.length > 0 && (
//                         <FormField
//                           control={form.control}
//                           name="docketNumber"
//                           render={({ field }) => (
//                             <FormItem className="flex-1">
//                               <FormLabel>Docket Number</FormLabel>
//                               <Popover>
//                                 <PopoverTrigger asChild>
//                                   <FormControl>
//                                     <Button
//                                       variant="outline"
//                                       role="combobox"
//                                       className={cn(
//                                         "w-full justify-between",
//                                         !field.value && "text-muted-foreground"
//                                       )}
//                                     >
//                                       {field.value
//                                         ? field.value === "null"
//                                           ? "-----null-----"
//                                           : `${
//                                               docketNumbers.success.find(
//                                                 (cust) =>
//                                                   cust.docketNumber ===
//                                                   field.value
//                                               )?.docketNumber
//                                             } | ${
//                                               docketNumbers.success.find(
//                                                 (cust) =>
//                                                   cust.docketNumber ===
//                                                   field.value
//                                               )?.type
//                                             }`
//                                         : "Select docket Number"}
//                                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                     </Button>
//                                   </FormControl>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
//                                   <Command>
//                                     <CommandInput placeholder="Search docket Number..." />
//                                     <CommandList>
//                                       <CommandEmpty>
//                                         No docket found.
//                                       </CommandEmpty>
//                                       <CommandGroup>
//                                         <CommandItem
//                                           onSelect={() => {
//                                             form.setValue(
//                                               "docketNumber",
//                                               "null"
//                                             );
//                                           }}
//                                           key={"null"}
//                                           value={"null"}
//                                         >
//                                           <div className="flex items-center gap-4">
//                                             <span>{"-----null-----"}</span>
//                                           </div>
//                                         </CommandItem>
//                                         {/* {docketNumbers.success.} */}
//                                         {docketNumbers?.success.map(
//                                           (language) => (
//                                             <CommandItem
//                                               value={language.docketNumber}
//                                               key={language.docketNumber}
//                                               onSelect={() => {
//                                                 form.setValue(
//                                                   "docketNumber",
//                                                   language.docketNumber
//                                                 );
//                                               }}
//                                             >
//                                               <Check
//                                                 className={cn(
//                                                   "mr-2 h-4 w-4",
//                                                   language.docketNumber ===
//                                                     field.value
//                                                     ? "opacity-100"
//                                                     : "opacity-0"
//                                                 )}
//                                               />
//                                               {language.docketNumber} |{" "}
//                                               {language.type}
//                                             </CommandItem>
//                                           )
//                                         )}
//                                       </CommandGroup>
//                                     </CommandList>
//                                   </Command>
//                                 </PopoverContent>
//                               </Popover>

//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       )
//                     ) : (
//                       <FormField
//                         disabled={isLoading}
//                         control={form.control}
//                         name="docketNumber"
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormLabel>Docket Number</FormLabel>
//                             <FormControl>
//                               <Input
//                                 disabled={
//                                   inwardType === "REPLACE_ALUMINUM" ||
//                                   inwardType === "RETURNABLE"
//                                 }
//                                 placeholder="Docket Number"
//                                 {...field}
//                               ></Input>
//                             </FormControl>
//                             <FormMessage></FormMessage>
//                           </FormItem>
//                         )}
//                       ></FormField>
//                     )}
//                     <FormField
//                       disabled={isLoading}
//                       control={form.control}
//                       name="docketDate"
//                       render={({ field }) => (
//                         <FormItem className="flex-1 ">
//                           <FormLabel>Docket Date</FormLabel>
//                           <FormControl>
//                             <div className="">
//                               <Popover>
//                                 <PopoverTrigger asChild>
//                                   <Button
//                                     variant={"outline"}
//                                     className={cn(
//                                       "w-full justify-start text-left font-normal",
//                                       !date && "text-muted-foreground"
//                                     )}
//                                   >
//                                     <CalendarIcon className="mr-2 h-4 w-4" />
//                                     {date ? (
//                                       format(date, "PPP")
//                                     ) : (
//                                       <span>Pick a date</span>
//                                     )}
//                                   </Button>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
//                                   <div className="rounded-md border w-full">
//                                     <Calendar
//                                       className=""
//                                       mode="single"
//                                       selected={date}
//                                       onSelect={setDate}
//                                     />
//                                   </div>
//                                 </PopoverContent>
//                               </Popover>
//                             </div>
//                           </FormControl>
//                           <FormMessage></FormMessage>
//                         </FormItem>
//                       )}
//                     ></FormField>{" "}
//                     <FormField
//                       disabled={isLoading}
//                       control={form.control}
//                       name="weight"
//                       render={({ field }) => {
//                         return (
//                           <FormItem className="flex-1">
//                             <FormLabel>Weight </FormLabel>
//                             <FormControl>
//                               <Input
//                                 placeholder="Weight"
//                                 {...field}
//                                 type="number"
//                               ></Input>
//                             </FormControl>
//                             <FormMessage></FormMessage>
//                           </FormItem>
//                         );
//                       }}
//                     ></FormField>
//                     <FormField
//                       disabled={isLoading}
//                       control={form.control}
//                       name="quantity"
//                       render={({ field }) => (
//                         <FormItem className="flex-1">
//                           <FormLabel>Quantity</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Quantity"
//                               {...field}
//                               type="number"
//                             ></Input>
//                           </FormControl>
//                           <FormMessage></FormMessage>
//                         </FormItem>
//                       )}
//                     ></FormField>
//                     <FormField
//                       disabled={isLoading}
//                       control={form.control}
//                       name="price"
//                       render={({ field }) => (
//                         <FormItem className="flex-1">
//                           <FormLabel>Price</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Price"
//                               {...field}
//                               type="number"
//                             ></Input>
//                           </FormControl>
//                           <FormMessage></FormMessage>
//                         </FormItem>
//                       )}
//                     ></FormField>
//                     {inwardType === "CASTING" &&
//                       ProductFields.map((fields, index) => {
//                         return (
//                           <div className="flex items-end col-span-3 gap-2">
//                             {products?.success &&
//                               products?.success.length > 0 && (
//                                 <FormField
//                                   control={form.control}
//                                   name={`Castings.${index}.castingId`}
//                                   render={({ field }) => (
//                                     <FormItem className="flex-1">
//                                       {index === 0 && (
//                                         <FormLabel>Product</FormLabel>
//                                       )}
//                                       <Popover>
//                                         <PopoverTrigger asChild>
//                                           <FormControl>
//                                             <Button
//                                               variant="outline"
//                                               role="combobox"
//                                               className={cn(
//                                                 "w-full justify-between",
//                                                 !field.value &&
//                                                   "text-muted-foreground"
//                                               )}
//                                             >
//                                               {field.value
//                                                 ? field.value === "null"
//                                                   ? "-----null-----"
//                                                   : products.success.find(
//                                                       (cust) =>
//                                                         cust.id === field.value
//                                                     )?.name
//                                                 : "Select Product"}
//                                               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                             </Button>
//                                           </FormControl>
//                                         </PopoverTrigger>
//                                         <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
//                                           <Command>
//                                             <CommandInput placeholder="Search product..." />
//                                             <CommandList>
//                                               <CommandEmpty>
//                                                 No product found.
//                                               </CommandEmpty>
//                                               <CommandGroup>
//                                                 <CommandItem
//                                                   onSelect={() => {
//                                                     form.setValue(
//                                                       `Castings.${index}.castingId`,
//                                                       "null"
//                                                     );
//                                                   }}
//                                                   key={"null"}
//                                                   value={"null"}
//                                                 >
//                                                   <div className="flex items-center gap-4">
//                                                     <span>
//                                                       {"-----null-----"}
//                                                     </span>
//                                                   </div>
//                                                 </CommandItem>
//                                                 {products.success.map(
//                                                   (language) => (
//                                                     <CommandItem
//                                                       value={language.name}
//                                                       key={language.id}
//                                                       onSelect={() => {
//                                                         form.setValue(
//                                                           `Castings.${index}.castingId`,
//                                                           language.id
//                                                         );
//                                                       }}
//                                                     >
//                                                       <Check
//                                                         className={cn(
//                                                           "mr-2 h-4 w-4",
//                                                           language.name ===
//                                                             field.value
//                                                             ? "opacity-100"
//                                                             : "opacity-0"
//                                                         )}
//                                                       />
//                                                       {language.name}
//                                                     </CommandItem>
//                                                   )
//                                                 )}
//                                               </CommandGroup>
//                                             </CommandList>
//                                           </Command>
//                                         </PopoverContent>
//                                       </Popover>

//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                               )}
//                             <FormField
//                               disabled={isLoading}
//                               control={form.control}
//                               name={`Castings.${index}.description`}
//                               render={({ field }) => (
//                                 <FormItem className="flex-1">
//                                   {index === 0 && (
//                                     <FormLabel>Description</FormLabel>
//                                   )}
//                                   <FormControl>
//                                     <Input
//                                       placeholder="Description"
//                                       {...field}
//                                     ></Input>
//                                   </FormControl>
//                                   <FormMessage></FormMessage>
//                                 </FormItem>
//                               )}
//                             ></FormField>
//                             <FormField
//                               disabled={isLoading}
//                               control={form.control}
//                               name={`Castings.${index}.weight`}
//                               render={({ field }) => (
//                                 <FormItem className="flex-1">
//                                   {index === 0 && <FormLabel>Weight</FormLabel>}
//                                   <FormControl>
//                                     <Input
//                                       placeholder="Weight"
//                                       type="number"
//                                       {...field}
//                                     ></Input>
//                                   </FormControl>
//                                   <FormMessage></FormMessage>
//                                 </FormItem>
//                               )}
//                             ></FormField>
//                             <FormField
//                               disabled={isLoading}
//                               control={form.control}
//                               name={`Castings.${index}.quantity`}
//                               render={({ field }) => (
//                                 <FormItem className="flex-1">
//                                   {index === 0 && (
//                                     <FormLabel>Quantity</FormLabel>
//                                   )}
//                                   <FormControl>
//                                     <Input
//                                       placeholder="Quantity"
//                                       type="number"
//                                       {...field}
//                                     ></Input>
//                                   </FormControl>
//                                   <FormMessage></FormMessage>
//                                 </FormItem>
//                               )}
//                             ></FormField>
//                             {ProductFields.length - 1 === index && (
//                               <Button
//                                 type="button"
//                                 onClick={() =>
//                                   ProductAppend({
//                                     id: ObjectID().toString(),
//                                     castingId: "",
//                                     description: "",
//                                     quantity: 0,
//                                     weight: 0,
//                                   })
//                                 }
//                               >
//                                 +
//                               </Button>
//                             )}
//                             {index !== 0 && (
//                               <Button
//                                 type="button"
//                                 onClick={() => ProductRemove(index)}
//                               >
//                                 -
//                               </Button>
//                             )}
//                           </div>
//                         );
//                       })}
//                   </div>

//                   {inwardType !== "CASTING" && fields.length == 0 && (
//                     <Button
//                       type="button"
//                       className="mt-10 w-80 mx-auto"
//                       onClick={() =>
//                         append({
//                           id: ObjectID().toString(),
//                           index: 0,
//                           weight: 0,
//                           quantity: 0,
//                           quantityType:
//                             aluminumType === "SCRAP" ? "Bags" : "Slab",
//                         })
//                       }
//                     >
//                       open Weight Calculator
//                     </Button>
//                   )}
//                   {fields.length > 0 && (
//                     <CardTitle className="mt-10">Weight Calculator</CardTitle>
//                   )}
//                   {fields.map((field, index) => {
//                     return (
//                       <div className="" key={field.id}>
//                         <div className="flex md:flex-row gap-4 items-end">
//                           <FormField
//                             disabled={isLoading}
//                             control={form.control}
//                             name={`TransactionCalculation.${index}.weight`}
//                             render={({ field }) => (
//                               <FormItem className="flex-1">
//                                 {index === 0 && <FormLabel>Weight</FormLabel>}
//                                 <FormControl>
//                                   <Input
//                                     placeholder="Weight"
//                                     type="number"
//                                     {...field}
//                                   ></Input>
//                                 </FormControl>
//                                 <FormMessage></FormMessage>
//                               </FormItem>
//                             )}
//                           ></FormField>
//                           <FormField
//                             disabled={isLoading}
//                             control={form.control}
//                             name={`TransactionCalculation.${index}.quantity`}
//                             render={({ field }) => (
//                               <FormItem className="flex-1">
//                                 {index === 0 && <FormLabel>Quantity</FormLabel>}
//                                 <FormControl>
//                                   <Input
//                                     placeholder="Quantity"
//                                     type="number"
//                                     {...field}
//                                   ></Input>
//                                 </FormControl>
//                                 <FormMessage></FormMessage>
//                               </FormItem>
//                             )}
//                           ></FormField>
//                           {fields.length - 1 === index && (
//                             <Button
//                               type="button"
//                               onClick={() =>
//                                 append({
//                                   id: ObjectID().toString(),
//                                   index: index,
//                                   weight: 0,
//                                   quantity: 0,
//                                   quantityType:
//                                     aluminumType === "SCRAP" ? "Bags" : "Slabs",
//                                 })
//                               }
//                             >
//                               +
//                             </Button>
//                           )}
//                           <Button type="button" onClick={() => remove(index)}>
//                             -
//                           </Button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </>
//               )}

//               {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}

//               {/* ////////////////////////////////////////////////////////////////////////////////////////////////// */}
//               <Button
//                 type="submit"
//                 className="bg-exec hover:bg-exec/90"
//                 disabled={isLoading}
//               >
//                 {isLoading ? <Loading /> : "Save Transaction Information"}
//               </Button>
//             </form>
//           </Form>
//           {transaction?.id && (
//             <>
//               <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
//                 <div className="">
//                   <div className="">Danger Zone</div>
//                 </div>
//                 <div className="text-muted-foreground">
//                   Deleting your category cannot be undone. This will also make
//                   the inventory
//                 </div>
//                 <AlertDialogTrigger
//                   disabled={isLoading || deletingTransaction}
//                   className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
//                 >
//                   {deletingTransaction ? "Deleting..." : "Delete Transaction"}
//                 </AlertDialogTrigger>
//               </div>
//             </>
//           )}
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="text-left">
//                 Are you absolutely sure?
//               </AlertDialogTitle>
//               <AlertDialogDescription className="text-left">
//                 This action cannot be undone. This will permanently delete the
//                 Quotation.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter className="flex items-center">
//               <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 disabled={deletingTransaction}
//                 className="bg-destructive hover:bg-destructive"
//                 onClick={handleTransaction}
//               >
//                 Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </CardContent>
//       </Card>
//     </AlertDialog>
//   );
// };

// export default TransactionForm;
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
    if (inwardType === "CASTING") {
      productAppend({
        id: ObjectID().toString(),
        castingId: "",
        description: "",
        quantity: 0,
        weight: 0,
      });
    }
  }, [inwardType]);

  if (
    weightCalculations &&
    weightCalculations.length > 0 &&
    inwardType !== "CASTING"
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
    inwardType === "CASTING"
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
      status === "OUT") &&
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
  const fetchProducts = inwardType === "CASTING";

  const { data: docketNumbers } = useGetDocketNumberForSelect(suppId, fetch);
  const { data: products } = useGetCastingsForSelect(fetchProducts);

  const onSubmit = async (values: AluminumTransactionCreationRequest) => {
    if (!values.supplierId) {
      return toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Please Select Supplier to submit the form.",
      });
    }
    if (inwardType !== "CASTING") {
      values.Castings = [];
    }
    if (fetch && docketNumbers?.success) {
      const alType = docketNumbers?.success.find(
        (el) => el.docketNumber === values.docketNumber
      )?.type;
      values.aluminumType = alType as ALUMINUMTYPE;
    }
    values.docketDate = date;
    values.quantityType = values.aluminumType === "SCRAP" ? "Bags" : "Slabs";
    values.weight === Number(values.weight);

    console.log(values);

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
                      title="Supplier"
                      control={form.control}
                      isLoading={isLoading}
                      label="Type of Inward"
                      name="supplierId"
                      select={supplier
                        .filter((supp) => supp.type !== "USER")
                        .map((supp) => {
                          return {
                            id: supp.id,
                            value: supp.name,
                          };
                        })}
                      placeholder="Select type of inward"
                    ></TransitionCombo>
                    {/* SUPPLIER */}

                    {/* USER */}
                    {(inwardType === "RETURNABLE" || status === "OUT") && (
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
                    ) : (
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
                  {inwardType === "CASTING" &&
                    productFields.map((fields, index) => {
                      return (
                        <div className="flex items-end col-span-3 gap-2">
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
                    })}
                  {/* Weight Calculation */}
                  {inwardType !== "CASTING" && weightFields.length == 0 && (
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
