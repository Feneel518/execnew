import { User } from "next-auth";
import { FC } from "react";

interface DashboardNavigationBarProps {
  user: User;
}

const DashboardNavigationBar: FC<DashboardNavigationBarProps> = ({ user }) => {
  return (
    <div className="h-[110px] border-b border-slate-600 w-full flex items-center p-10 print:hidden">
      <h1 className="text-3xl">Welcome, {user.name}</h1>
    </div>
  );
};

export default DashboardNavigationBar;
