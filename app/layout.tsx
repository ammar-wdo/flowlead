import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ModalsProvider from "@/providers/modals-provider";
import { EdgeStoreProvider } from "../lib/edgestore";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import "quill/dist/quill.snow.css"; // Import the snow theme CSS
import { cn } from "@/lib/utils";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Flowlead",
  description: "Flowlead App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
       

        <body className={cn(poppins.className, "scroll")}>
          <EdgeStoreProvider>
            <NextTopLoader height={0} color="#111725"   />
            {children}
            <ModalsProvider />
          </EdgeStoreProvider>
          <Toaster position="top-center" richColors />
          <Script
          type="text/javascript"
          src="https://cdn.weglot.com/weglot.min.js"
           strategy="beforeInteractive"
        ></Script>
        <Script id="weglot-init"  strategy="beforeInteractive">
          {`
              Weglot.initialize({
                api_key: 'wg_a6811f9e36ef92df3e837cfcb6f915059'
              });
            `}
        </Script>
        </body>
      </html>
    </ClerkProvider>
  );
}
