import { auth } from "@/auth";
import DashboardNavigationBar from "@/components/Dashboard/DashboardNavigationBar";
import Sidebar from "@/components/Dashboard/Sidebar";
import Unauthorized from "@/components/Global/Unauthorized";
import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = async ({ children }) => {
  const session = await auth();

  if (session?.user.role === "USER" || !session?.user)
    return <Unauthorized></Unauthorized>;

  if (session.user.role === "ADMIN" || session.user.role === "STORE")
    return (
      <div className="min-h-screen flex text-white ">
        <Sidebar session={session.user}></Sidebar>
        <div className="lg:pl-[300px] w-full">
          <DashboardNavigationBar user={session.user}></DashboardNavigationBar>
          <div className=" p-2 lg:p-10 print:p-0">{children}</div>
        </div>
      </div>
    );
  else {
    return <Unauthorized></Unauthorized>;
  }
};

export default layout;
