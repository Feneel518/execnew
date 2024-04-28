"use client";
import { FC } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Header from "./Header";
import Social from "./Social";
import BackButton from "./BackButton";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  firmName?: string;
  firmLogo?: string;
}

const CardWrapper: FC<CardWrapperProps> = ({
  firmName,
  firmLogo,
  backButtonHref,
  backButtonLabel,
  children,
  showSocial,
  headerLabel,
}) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header
          label={headerLabel}
          firmName={firmName}
          firmLogo={firmLogo}
        ></Header>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social></Social>
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref}></BackButton>
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
