'use client'
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import the snow theme CSS

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  onFocus?: (range: { index: number; length: number }) => void; // Corrected type for range
}

const QuillEditor = forwardRef<Quill | null, QuillEditorProps>(({ value, onChange, onFocus }, ref) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<Quill | null>(null);

  useImperativeHandle(ref, () => quillInstanceRef.current as Quill);

  useEffect(() => {
    if (quillRef.current && !quillInstanceRef.current) {
      quillInstanceRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
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

      quillInstanceRef.current.on('selection-change', (range) => {
        if (range && onFocus) {
          onFocus(range);
        }
      });
    }

    // Set initial value
    if (quillInstanceRef.current && quillInstanceRef.current.root.innerHTML !== value) {
      quillInstanceRef.current.root.innerHTML = value;
    }
  }, [value, onChange, onFocus]);

  return (
    <div className='w-full'>
      <div className='' ref={quillRef} />
    </div>
  );
});

export default QuillEditor;
