"use client";

import Loading from "@/components/Global/Loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactSchemeRequest, ContactValidator } from "@/lib/Validators";
import { bebas } from "@/lib/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Metadata } from "next";
import Link from "next/link";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const form = useForm<ContactSchemeRequest>({
    resolver: zodResolver(ContactValidator),
    defaultValues: {
      companyName: "",
      email: "",
      message: "",
      name: "",
      terms: false,
    },
  });

  const isLoading = form.formState.isLoading;

  const handleSubmit = () => {};
  return (
    <div className="max-2xl:mx-10 max-md:mx-2 mt-8 md:mt-14 relative">
      <h1 className={`${bebas.className} text-6xl max-md:text-5xl`}>
        Contact Us
      </h1>
      {/* separator */}
      <div className="h-1 md:h-2 w-10 md:w-20 bg-white rounded-lg mt-8 md:mt-14 "></div>
      {/* scroll */}
      {/* component */}
      <div className="flex max-lg:flex-col max-md:items-center  border-color mt-11 border-r-0 border-l-0">
        <div className="border-color border-bottom lg:border-r  flex-1 max-md:border-r-0 flex items-center justify-center">
          <iframe
            className="h-full w-full p-8 max-md:px-2 max-lg:h-[500px]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.511658615236!2d72.94117221545774!3d20.361783115586455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0ce5f1cf2266f%3A0x6ddcf3a18391fc44!2sExplosion%20proof%20electrical%20control!5e0!3m2!1sen!2sin!4v1677835028303!5m2!1sen!2sin"
            loading="lazy"
          ></iframe>
        </div>

        {/* middle */}
        <div className=" flex-1 border-color lg:border-right w-full pb-10">
          <div className="">
            <h1
              className={`${bebas.className} text-5xl text-center mt-6 md:mt-10  lg:mt-12 xl:text-5xl`}
            >
              CONTACT
            </h1>
            <div className="h-1 w-12 bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>
            <h1 className="text-2xl p-4 text-center underline underline-offset-8 decoration-1 ">
              Address
            </h1>
            <p className="ml-4 text-sm font-thin text-center lg:text-lg mb-10 max-lg:mb-2">
              <a href="https://goo.gl/maps/Dqb4hcD1kNvxjr1s6">
                Plot No. 920, G.I.D.C, Phase 4, Vapi, Gujarat, India.
              </a>
            </p>
          </div>
          <div className="">
            <h1 className="text-2xl p-4 text-center underline underline-offset-8 decoration-1 ">
              Opening Hours
            </h1>
            <p className="text-sm font-thin text-center lg:text-lg">
              Monday to Wednesday: 9am to 7pm
            </p>
            <p className="text-sm font-thin text-center mb-10 max-lg:mb-2 lg:text-lg">
              Friday to Sunday: 9am to 7pm
            </p>
          </div>
          <div className="">
            <h1 className="text-2xl p-4 text-center underline underline-offset-8 decoration-1 ">
              Email
            </h1>
            <p className="text-sm font-thin text-center mb-4 max-lg:mb-2 lg:text-lg">
              <a href="mailto:info@explosionproofelectrical.com">
                info@explosionproofelectrical.com
              </a>
            </p>
            <p className="text-sm font-thin text-center mb-10 max-lg:mb-2 lg:text-lg">
              <a href="mailto:exec@rediffmail.com">exec@rediffmail.com</a>
            </p>
          </div>
          <div className="">
            <h1 className="text-2xl p-4 text-center underline underline-offset-8 decoration-1 ">
              Phone
            </h1>
            <p className="text-sm font-thin text-center mb-4 max-lg:mb-2 lg:text-lg">
              <a href="https://wa.me/+919099064667">+91 9099064667</a>
            </p>
            <p className="text-sm font-thin text-center mb-10 max-lg:mb-2 lg:text-lg">
              <a href="https://wa.me/+919824418868">+91 9824418868</a>
            </p>
          </div>
        </div>

        {/* riight */}
        <div className=" flex-1 flex flex-col items-center justify-center">
          <h1
            className={`${bebas.className} ml-4 text-4xl text-center mt-10  lg:mt-12 xl:text-5xl`}
          >
            Feel Free to Contact Us.
          </h1>
          <div className="h-1 w-12  bg-white rounded-lg flex items-center justify-center mt-2 mb-4"></div>
          <div className=" w-full h-full px-8">
            <div className="grid grid-cols-2 md:grid-cols-1"></div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-10 pb-10"
              >
                <div className="flex mf:flex-row gap-4">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Full Name:</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-transparent border-white/50"
                            placeholder="Your Full Name"
                            {...field}
                          ></Input>
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <div className="flex mf:flex-row gap-4">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Email Address:</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-transparent border-white/50"
                            placeholder="Your email"
                            {...field}
                          ></Input>
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <div className="flex mf:flex-row gap-4">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Company Name:</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-transparent border-white/50"
                            placeholder="Your Company  Name"
                            {...field}
                          ></Input>
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <div className="flex mf:flex-row gap-4">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Message:</FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-transparent border-white/50"
                            rows={10}
                            placeholder="I'd like to inquire about..."
                            {...field}
                          ></Textarea>
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  ></FormField>
                </div>

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/50 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the{" "}
                          <Link
                            className="hover:underline"
                            href={"/terms-and-conditions"}
                          >
                            Terms and Conditions.
                          </Link>
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex flex-col">
                  <Button
                    variant={"whiteLink"}
                    type="submit"
                    className="text-xl text-center hover:no-underline "
                    disabled={isLoading}
                  >
                    {isLoading ? <Loading /> : "Contact Us."}
                  </Button>
                  <div className="h-[1px] w-[100px] bg-amber-600 rounded-lg relative left-2/4 -translate-x-2/4  mb-10"></div>
                </div>
              </form>
            </Form>
            {/* {submitted ? (
          <div className="m-10">
            <h1
              className={`${bebas.className} text-center mt-8 text-2xl mx-4 max-lg:text-2xl`}
            >
              Thanks for the Email{" "}
              <span className="text-4xl">{formik.values.name}</span>
            </h1>
            <p className="text-sm text-center font-thin">
              We will get back to you as soon as we can!
            </p>
            <p className="text-sm text-center font-thin">
              For any further assistance you can email us at Info
            </p>
          </div>
        ) : (
          <div>
            <h1
              className={`${bebas.className} ml-4 text-4xl text-center mt-10  lg:mt-12 xl:text-5xl`}
            >
              Feel Free to Contact Us.
            </h1>
            <div className="h-1 w-12  bg-white rounded-lg relative left-2/4 -translate-x-2/4 mt-2 mb-4"></div>

           
          </div>
        )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
