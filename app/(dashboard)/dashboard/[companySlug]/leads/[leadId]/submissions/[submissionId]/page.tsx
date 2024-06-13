import React from 'react'

type Props = {params:{companySlug:string,leadId:string,submissionId:string}}

const page = ({params:{companySlug,leadId,submissionId}}: Props) => {
  return (
    <div>{submissionId}</div>
  )
}

export default page