'use client';

import { cn } from '@/lib/utils';
import {
  CheckCircleIcon,
  FileIcon,
  Loader,
  LucideFileWarning,
  Trash2Icon,
  UploadCloudIcon,
  XIcon,
} from 'lucide-react';
import * as React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

const variants = {
  base: 'relative rounded-md p-4 w-full max-w-[calc(100vw-1rem)] flex justify-center items-center flex-col cursor-pointer border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out',
  active: 'border-2',
  disabled:
    'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700 dark:border-gray-600',
  accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
  reject: 'border border-red-700 bg-red-700 bg-opacity-10',
};

export type FileState = {
  file: File;
  key: string; // used to identify the file in the progress callback
  url?:string
  progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  setDeleting:(url:string)=>void
  deleting:string
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return 'Invalid file type.';
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return 'The file is not supported.';
  },
};

const MultiFileDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { dropzoneOptions, value, className, disabled, onFilesAdded, onChange ,setDeleting,deleting},
    ref,
  ) => {
    const [customError, setCustomError] = React.useState<string>();
    if (dropzoneOptions?.maxFiles && value?.length) {
      disabled = disabled ?? value.length >= dropzoneOptions.maxFiles;
    }
    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);
        if (
          dropzoneOptions?.maxFiles &&
          (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
        ) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }
        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: 'PENDING',
          }));
          void onFilesAdded?.(addedFiles);
          void onChange?.([...(value ?? []), ...addedFiles]);
        }
      },
      ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className,
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ],
    );

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === 'file-too-large') {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === 'file-invalid-type') {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === 'too-many-files') {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);
   
    
    return (
      <div className='w-full'>
        <div className="flex flex-col gap-2 w-full">
          <div>
            {/* Main File Input */}
            <div
              {...getRootProps({
                className: dropZoneClassName,
              })}
            >
              <input ref={ref} {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-xs text-gray-400">
                <UploadCloudIcon className="mb-1 h-7 w-7" />
                <div className="text-gray-400">
                  drag & drop or click to upload
                </div>
              </div>
            </div>

            {/* Error Text */}
            <div className="mt-1 text-xs text-red-500">
              {customError ?? errorMessage}
            </div>
          </div>

          {/* Selected Files */}
          {value?.map(({ file, progress,url }, i) => 
         
            { 
                if(progress === 100){
                    setTimeout(()=>{ onChange?.([])},1000)
                   
                     }
                return <div
              key={i}
              className={cn("flex  w-full max-w-[100vw] flex-col justify-center rounded border border-gray-300 px-4 py-4 relative overflow-hidden" )}
            >
                 {(!!deleting && deleting === url ) && <div className=' gap-1 text-xs  w-full h-full absolute top-0 left-0 bg-black/80 text-white z-10 flex items-center justify-center'>Deleteing... <Loader size={16} className='animate-spin ml-2' /></div>}
                {!deleting &&  <XIcon onClick={()=> setDeleting(url || "")} className='absolute top-0.5 right-0.5 cursor-pointer ' size={14}/>}
              <div className="flex items-center gap-2 text-gray-500 dark:text-white">
              <span className="w-12 h-12 flex items-center justify-center bg-second/10 rounded-full shrink-0">
                                <FileIcon className="text-second"/>
                              </span>
                <div className="min-w-0 text-sm">
                  <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <div className="grow" />
                <div className="flex w-12 justify-end text-xs">
                  {progress === 'PENDING' ? (
                    <button
                      className="rounded-md p-1 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        void onChange?.(
                          value.filter((_, index) => index !== i),
                        );
                      }}
                    >
                      <Trash2Icon className="shrink-0" />
                    </button>
                  ) : progress === 'ERROR' ? (
                    <LucideFileWarning className="shrink-0 text-red-600 dark:text-red-400" />
                  ) : progress !== 'COMPLETE' ? (
                    <div>{Math.round(progress)}%</div>
                  ) : (
                    <CheckCircleIcon className="shrink-0 text-second dark:text-gray-400" />
                  )}
                </div>
              </div>
              {/* Progress Bar */}
              {typeof progress === 'number' && (
                <div className="relative h-0 my-3">
                  <div className="absolute top-1 h-1 w-full overflow-clip rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-second transition-all duration-300 ease-in-out dark:bg-white"
                      style={{
                        width: progress ? `${progress}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              )}

             
            </div>}
          )}
        </div>
      </div>
    );
  },
);
MultiFileDropzone.displayName = 'MultiFileDropzone';

function formatFileSize(bytes?: number) {
  if (!bytes) {
    return '0 Bytes';
  }
  bytes = Number(bytes);
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export { MultiFileDropzone };