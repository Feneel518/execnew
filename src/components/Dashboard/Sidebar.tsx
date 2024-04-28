import { FC } from "react";
import MenuOptions from "./MenuOptions";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  return (
    <div className="">
      <MenuOptions defaultOpen={true}></MenuOptions>
      <MenuOptions></MenuOptions>
    </div>
  );
};

export default Sidebar;
