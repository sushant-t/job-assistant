import React, { PropsWithChildren } from "react";
import ComplexNavbar from "./ComplexNavbar";
import Navbar from "./Navbar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ComplexNavbar />
      <div>{children}</div>
    </>
  );
};
export default Layout;
