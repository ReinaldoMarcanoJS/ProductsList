import type { ReactNode } from "react";

import "./styles/globals.css";
import styles from "./styles/layout.module.css";
import { Toaster } from "@/components/ui/toaster";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <section className={styles.container}>
          <main className={styles.main}>{children}</main>
          <Toaster />
        </section>
      </body>
    </html>
  );
}
