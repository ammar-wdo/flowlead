import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const {userId} = auth()
  return (
  <div className="min-h-screen flex items-center justify-center">
  <Link href={'/dashboard'} className="p-3 rounded-xl bg-black text-white">
{userId ? 'Dashboard' : 'Ge Started'}
  </Link>
  </div>
  );
}
