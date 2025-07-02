"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { upsertTodo } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { TaskCreationRequest, TaskValidator } from "@/lib/Validators";
import { zodResolver } from "@hookform/resolvers/zod";
import ObjectID from "bson-objectid";
import { addDays, format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

interface CreateATaskProps {}

const CreateATask: FC<CreateATaskProps> = ({}) => {
  const [date, setDate] = useState<Date | undefined>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const form = useForm<TaskCreationRequest>({
    resolver: zodResolver(TaskValidator),
    defaultValues: {
      id: ObjectID().toString(),
      priority: "LOW",
      dueDate: date,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: TaskCreationRequest) => {
    values.id = ObjectID().toString();
    const response = await upsertTodo(values);

    if (response?.success) {
      toast({
        title: "Your todo has been created.",
      });
      setOpen(false);
      router.refresh();
    }
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not create your quotation, please try again later",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className=" hover:bg-bamboo-500 rounded-full p-1 transition-all duration-100 ease-in-out">
          <PlusCircle className="cursor-pointer" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full py-4 grid gap-4"
          >
            <TextareaAutosize
              onChange={(e) => {
                form.setValue("task", e.target.value);
              }}
              placeholder="Task"
              className="w-full text-xl border-0 placeholder:pl-2 border-b-2 ring-offset-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <div className="grid grid-cols-3 items-center gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem key={"HIGH"} value={"HIGH"}>
                            High
                          </SelectItem>
                          <SelectItem key={"MEDIUM"} value={"MEDIUM"}>
                            Medium
                          </SelectItem>
                          <SelectItem key={"LOW"} value={"LOW"}>
                            Low
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex-1 ">
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
                                <span>Due date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                            <Select
                              onValueChange={(value) =>
                                setDate(addDays(new Date(), parseInt(value)))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="0">Today</SelectItem>
                                <SelectItem value="1">Tomorrow</SelectItem>
                                <SelectItem value="3">In 3 days</SelectItem>
                                <SelectItem value="7">In a week</SelectItem>
                                <SelectItem value="14">In two week</SelectItem>
                                <SelectItem value="21">
                                  In three week
                                </SelectItem>
                                <SelectItem value="28">In four week</SelectItem>
                                <SelectItem value="35">In five week</SelectItem>
                              </SelectContent>
                            </Select>
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
                  </FormItem>
                )}
              ></FormField>
            </div>

            <div className="">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateATask;
