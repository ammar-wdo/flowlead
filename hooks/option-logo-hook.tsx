"use client";
import { useEdgeStore } from "@/lib/edgestore";
import { Loader, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  form: any;
  index:number
};

export const useOptionLogo = ({ form,index }: Props) => {
  const [file, setFile] = useState<File>();

  const [deleteLoader, setDeleteLoader] = useState(false);

  const [imageLoader, setImageLoader] = useState(false);
  const { edgestore } = useEdgeStore();

  const uploadImage = async () => {
    if (file) {
      console.log(file);
      setImageLoader(true);
      if (file) {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            if (progress === 0) {
              setImageLoader(true);
            } else {
              setImageLoader(false);
            }
          },
        });
        setImageLoader(false);
        console.log(res.url);
        setImage(res.url);
      }
    }
  };

  const deleteImage = async (image: string) => {
    try {
      setDeleteLoader(true);
      await edgestore.publicFiles.delete({
        url: image,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoader(false);
      setImage("");
    }
  };

  const setImage = (url: string) => {
    form.setValue(`options.${index}.image`, url);
   
  };
  const ImagePlaceholder = () => {
    if (!!form?.watch(`options.${index}.image`))
      return (
        <div  className=" w-[150px] h-[150px]  relative">
          {deleteLoader ? (
            <div className="flex items-center justify-center w-full h-full ">
              <Loader className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <Image
              alt="added logo"
              src={form.getValues(`options.${index}.image`)}
             fill
              className="object-contain rounded-lg"
            />
          )}

          <XIcon
            className="absolute top-0 right-0 cursor-pointer text-white bg-rose-400 w-4 h-4 p-0.5 rounded-md"
            onClick={() => {
              deleteImage(form.getValues(`options.${index}.image`));
            }}
          />
        </div>
      );
    if (imageLoader)
      return (
        <div  className="w-[150px] h-[150px] overflow-hidden flex items-center justify-center  relative">
          {" "}
          <Loader className="w-5 h-5 animate-spin" />
        </div>
      );
  };

  return { file, setFile, uploadImage, ImagePlaceholder };
};

