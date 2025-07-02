"use client";

import { Bebas_Neue } from "next/font/google";
import { FC, useState } from "react";
import { Input } from "../../ui/input";
import { useForm } from "react-hook-form";
import {
  newsLetterRequest,
  newsLetterValidator,
} from "@/lib/Validators/NewsLetterValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../ui/form";
import { Button } from "../../ui/button";

interface NewsLetterProps {}

const bebas = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas",
});

const NewsLetter: FC<NewsLetterProps> = ({}) => {
  const [submitted, setSubmitted] = useState(false);

  const handleNewsLetter = () => {
    setSubmitted(true);

    // const isFormValidated = onValidated({ data });

    // return data;
  };

  const form = useForm<newsLetterRequest>({
    resolver: zodResolver(newsLetterValidator),
    mode: "onChange",
    defaultValues: {
      companyName: "",
      email: "",
      name: "",
    },
  });

  const handleSubmit = (data: newsLetterRequest) => {};

  const isLoading = form.formState.isSubmitting;
  return (
    <div className="mt-10 md:mt-24 relative border-color border-bottom ">
      {/* Mailchimp */}

      {submitted ? (
        <div className="mb-24">
          <h1
            className={`${bebas.className} text-6xl text-center lg:text-6xl tracking-wide`}
          >
            Thanks for being a part of our Family!
          </h1>
        </div>
      ) : (
        <div className="">
          <h1
            className={`${bebas.className} text-5xl text-center lg:text-6xl tracking-wide max-lg:pt-10`}
          >
            BE A PART OF OUR FAMILY IN INDIA
          </h1>
          <div className="h-1 w-12 bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className=" flex flex-col  items-center justify-center gap-10 my-10"
            >
              <div className="flex items-center justify-center gap-20 max-lg:flex-col max-lg:gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-transparent border-0 border-b rounded-none max-md:mt-4 placeholder:text-white placeholder:font-thin placeholder:text-xl h-14 w-72 focus-visible:ring-0   focus-visible:ring-offset-0 focus:outline-none px-4"
                          type="text"
                          placeholder="Full Name"
                          autoComplete="none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-transparent border-0 border-b rounded-none max-md:mt-4 placeholder:text-white placeholder:font-thin placeholder:text-xl h-14 w-72 focus-visible:ring-0   focus-visible:ring-offset-0 focus:outline-none px-4"
                          type="email"
                          placeholder="Email Address"
                          autoComplete="none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-transparent border-0 border-b rounded-none max-md:mt-4 placeholder:text-white placeholder:font-thin placeholder:text-xl h-14 w-72 focus-visible:ring-0   focus-visible:ring-offset-0 focus:outline-none px-4"
                          type="text"
                          placeholder="Company Name"
                          autoComplete="none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <Button
                onClick={handleNewsLetter}
                className="w-72 text-2xl  font-light tracking-[4px] flex flex-col justify-center items-center "
                variant={"ghost"}
                size={"lg"}
              >
                <span className="border-b border-amber-600">Subscribe</span>
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default NewsLetter;
