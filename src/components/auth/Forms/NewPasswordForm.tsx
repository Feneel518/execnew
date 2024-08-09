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

import { useSearchParams } from "next/navigation";
import { NewPasswordSchema, NewPasswordSchemaRequest } from "@/lib/Validators";
import { newPassword } from "@/lib/queries";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

interface NewPasswordFormProps {}

const NewPasswordForm: FC<NewPasswordFormProps> = ({}) => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const [isPending, startTransiton] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<NewPasswordSchemaRequest>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: NewPasswordSchemaRequest) => {
    setError("");
    setSuccess("");
    startTransiton(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);

        // Add when we add 2FA
        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      firmName="Embold - The Bold"
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="******"
                      type="password"
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
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
