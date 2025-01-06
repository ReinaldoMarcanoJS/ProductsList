import type { Metadata } from "next";
import Login from "./login/page";

export default function IndexPage() {
  return <Login />;
}

export const metadata: Metadata = {
  title: "Redux Toolkit",
};
