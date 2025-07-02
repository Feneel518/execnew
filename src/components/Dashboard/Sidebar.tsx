import { FC } from "react";
import MenuOptions from "./MenuOptions";
import { User } from "next-auth";

interface SidebarProps {
  session: User & {
    role: string;
  };
  aluminum?: boolean;
}

const Sidebar: FC<SidebarProps> = ({ session, aluminum = false }) => {
  return (
    <div className="pint:hidden">
      <MenuOptions
        defaultOpen={true}
        session={session}
        aluminum={aluminum}
      ></MenuOptions>
      <MenuOptions session={session} aluminum={aluminum}></MenuOptions>
    </div>
  );
};

export default Sidebar;
