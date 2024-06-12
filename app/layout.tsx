import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import ModalsProvider from "@/providers/modals-provider";
import { EdgeStoreProvider } from '../lib/edgestore';
import { Toaster } from "@/components/ui/sonner"
import NextTopLoader from 'nextjs-toploader';
import 'quill/dist/quill.snow.css'; // Import the snow theme CSS


const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"],weight:["100","200","300","400","500","600","700","800","900"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
     


    <html lang="en">

      <body className={poppins.className}>
      <EdgeStoreProvider>
      <NextTopLoader   height={4} color="#111725"/>
        {children}
      <ModalsProvider/>
      </EdgeStoreProvider>
      <Toaster position="top-center" richColors/>
        </body>
   
    </html>
 
    </ClerkProvider>
  );
}
