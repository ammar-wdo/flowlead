'use client'

import React from 'react'
import QuillEditor from '../quill-editor'

type Props = {}

const FormsForm = (props: Props) => {
  return (
    <div className='h-full flex items-center justify-center'>    <QuillEditor value={''} onChange={(value:string)=>{}} /></div>
  )
}

export default FormsForm