import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter as FontSans } from "next/font/google";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const isLogged = localStorage.getItem("admin");

    if (!isLogged) {
      router.push("/login");
    }
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
      )}
    >
      <Layout>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
    </div>
  );
}
