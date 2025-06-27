"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


// /C:/Users/Rey/Desktop/proyects/ProductsList/app/page.tsx

export default function Home() {
  const router = useRouter();
    useEffect(() => {
      fetch("https://ve.dolarapi.com/v1/dolares/oficial")
        .then((res) => res.json())
        .then((data) => {
          // Suponiendo que quieres el promedio del BCV
  
  
          Cookies.set("dolar", JSON.stringify(data), { expires: 1 });
  
        })
        .catch((error) => {
          console.error("Error fetching dolar data:", error);
        });
    }, []);

  useEffect(() => {
    router.replace("dashboard/stats");
  }, [router]);

  return null;
}
