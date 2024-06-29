'use client'

import { useClerk } from '@clerk/nextjs';
import { Button } from './ui/button';
import { ImExit } from 'react-icons/im';
import { useTransition } from 'react';
import { Loader } from 'lucide-react';

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const [pending, startTransition] = useTransition()

  const handleLogout = ()=>{
    startTransition(()=>{
        signOut({redirectUrl:'/sign-in'})
    })
  }

  return (
    // Clicking on this button will sign out a user
    // and reroute them to the "/" (home) page.
    <Button disabled={pending} className='bg-transparent w-full  t border   py-[12px]   text-white/60 border-white/60 hover:text-white hover:border-white transition' onClick={handleLogout}>
      <ImExit className='mr-2'/> Sign out {pending && <Loader size={13} className='animate-spin ml-3'  />}
    </Button>
  );
};