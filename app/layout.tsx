import { type ReactNode } from "react";

import "./styles/globals.css";
import styles from "./styles/layout.module.css";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./components/Sidebar";

interface Props {
  readonly children: ReactNode;
}


export default function RootLayout({ children }: Props) {



  return (
    <html lang="en">
      <body>
      <section className="w-screen flex">
        <main className="w-full p-auto">{children}</main>
        <Toaster />
      </section>
      </body>
    </html>
  );
}
