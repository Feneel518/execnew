import { FC } from "react";
import MenuOptions from "./MenuOptions";
import { User } from "next-auth";

interface SidebarProps {
  session: User & {
    role: string;
  };
}

const Sidebar: FC<SidebarProps> = ({ session }) => {
  return (
    <div className="pint:hidden">
      <MenuOptions defaultOpen={true} session={session}></MenuOptions>
      <MenuOptions session={session}></MenuOptions>
    </div>
  );
};

export default Sidebar;
