import { prepareUser } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'
import { DashboardPrepare } from './dashboard-prepare';

type Props = {}

const PrepareUser = async(props: Props) => {

    await prepareUser();

    const user = await currentUser();
  
    const email = user?.emailAddresses[0].emailAddress;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eee] ">
    <DashboardPrepare email={email!} />
  </div>
  )
}

export default PrepareUser