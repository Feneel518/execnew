"use client";

import { FC, useState, useTransition } from "react";
import CardWrapper from "../CardWrapper";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResetSchema, ResetSchemaRequest } from "@/lib/Validators";
import { reset } from "@/lib/queries";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

interface ResetFormProps {}

const ResetForm: FC<ResetFormProps> = ({}) => {
  const [isPending, startTransiton] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<ResetSchemaRequest>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ResetSchemaRequest) => {
    setError("");
    setSuccess("");
    startTransiton(() => {
      reset(values).then((data) => {
        setError(data?.error);

        // Add when we add 2FA
        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      firmName="Embold - The Bold"
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    ></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
          </div>
          <FormError message={error}></FormError>
          <FormSuccess message={success}></FormSuccess>

          <Button disabled={isPending} type="submit" className="w-full">
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
