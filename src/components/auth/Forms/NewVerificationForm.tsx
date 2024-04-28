"use client";

import { FC, useCallback, useEffect, useState } from "react";
import CardWrapper from "../CardWrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/lib/queries";
import FormSuccess from "./FormSuccess";
import FormError from "./FormError";

interface NewVerificationFormProps {}

const NewVerificationForm: FC<NewVerificationFormProps> = ({}) => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Mission Token!");
      return;
    }
    newVerification(token)
      .then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      })
      .catch(() => {
        setError("Something went wronh!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader></BeatLoader>}
        <FormSuccess message={success}></FormSuccess>
        <FormError message={error}></FormError>
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
