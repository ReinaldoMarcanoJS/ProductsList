import type { Metadata } from "next";
import { redirect } from "next/navigation";

export default function IndexPage() {
  redirect("/login");
}

export const metadata: Metadata = {
  title: "Redux Toolkit",
};
