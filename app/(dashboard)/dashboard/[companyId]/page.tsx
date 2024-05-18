import React from 'react'

type Props = {params:{companyId:string}}

const page = ({params:{companyId}}: Props) => {
  return (
    <div>{companyId}</div>
  )
}

export default page