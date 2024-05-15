import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUp } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { upload } from "@/lib/requests";

function ImageUpload({ formField }: { formField: string }) {
  const [image, setImage] = useState<string>();
  const ref = React.useRef<HTMLInputElement>(null);
  const form = useFormContext();
  const imageField = form.watch(formField);

  useEffect(() => {
    if (imageField) {
      console.log("imageField", imageField);
      setImage(imageField);
    }
  }, [imageField]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      uploadImage(event.target.files[0]);
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const uploadImage = async (file: File) => {
    if (!file) return;
    // Implement the upload logic
    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await upload("/uploadImage", formData);

      if (result) {
        form.setValue(formField, "http://localhost:3001/" + result.path);
      } else {
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <Input
        ref={ref}
        className="hidden"
        placeholder="上传图片"
        type="file"
        onChange={handleImageChange}
      />
      <div className="w-full flex justify-center cursor-pointer">
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="h-20 w-20"
            onClick={() => ref.current?.click()}
          />
        ) : (
          <ImageUp
            strokeWidth={1}
            className="h-20 w-20"
            onClick={() => ref.current?.click()}
          />
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
