import Sidebar from "@/components/SideBar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" w-full flex justify-start items-start bg-white">
      <Sidebar />
      <div className=" flex-1">{children}</div>
    </div>
  );
};

export default layout;
