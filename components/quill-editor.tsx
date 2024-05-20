'use client'
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import the snow theme CSS

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current && !quillInstanceRef.current) {
      quillInstanceRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2,3,false] }],
            ['bold', 'italic', 'underline'],
            [{ color: [] }],
            [{ size: ['small', false, 'large', 'huge'] }]
   
          ],
        },
      });

      quillInstanceRef.current.on('text-change', () => {
        const content = quillInstanceRef.current!.root.innerHTML;
        onChange(content);
      });
    }

    // Set initial value
    if (quillInstanceRef.current && quillInstanceRef.current.root.innerHTML !== value) {
      quillInstanceRef.current.root.innerHTML = value;
    }
  }, [value, onChange]);

  return <div className='w-full'>
    <div className='' ref={quillRef} />
    </div>;
};

export default QuillEditor;
