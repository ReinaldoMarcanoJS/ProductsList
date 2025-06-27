import { type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "../components/Sidebar";
interface Props {
  readonly children: ReactNode;
}


export default function RootLayout({ children }: Props) {
  return (
      <main className="flex">
        <Sidebar/>
      <section className="w-screen flex">
        <main className="w-full p-auto px-10 ">{children}</main>
        <Toaster />
      </section>
      </main>
  );
}