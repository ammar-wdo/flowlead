'use client'

import React from 'react'
import QuillEditor from '../quill-editor'

type Props = {}

const FormsForm = (props: Props) => {
  return (
    <div>    <QuillEditor value={''} onChange={(value:string)=>{}} /></div>
  )
}

export default FormsForm