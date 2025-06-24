"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


// /C:/Users/Rey/Desktop/proyects/ProductsList/app/page.tsx

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/stats");
  }, [router]);

  return null;
}
