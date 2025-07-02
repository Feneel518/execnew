import { FC } from "react";
import { Card, CardFooter, CardHeader } from "../ui/card";
import Header from "./Header";
import BackButton from "./BackButton";

interface ErrorCardProps {}

const ErrorCard: FC<ErrorCardProps> = ({}) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oops! Someting went wrong!"></Header>
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to login" href="/auth/login"></BackButton>
      </CardFooter>
    </Card>
  );
};

export default ErrorCard;
