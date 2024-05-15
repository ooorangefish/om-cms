import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { upload } from "@/lib/requests";

function SongUpload() {
  const [isUploaded, setIsUploaded] = useState(false);
  const ref = React.useRef<HTMLInputElement>(null);
  const form = useFormContext();
  const filePath = form.watch("filePath");

  useEffect(() => {
    if (filePath) {
      setIsUploaded(true);
    }
  }, [filePath]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      uploadSong(event.target.files[0]);
    }
  };

  const uploadSong = async (file: File) => {
    if (!file) return;
    // Implement the upload logic
    const formData = new FormData();
    formData.append("song", file);

    try {
      const result = await upload("/uploadSong", formData);

      if (result) {
        console.log(result);
        form.setValue("filPath", "http://localhost:3001/" + result.path);
      } else {
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <Label className="mb-4">歌曲源文件</Label>
      <Input
        ref={ref}
        className="hidden"
        placeholder="上传歌曲"
        type="file"
        onChange={handleChange}
      />
      <div className="w-full flex justify-center cursor-pointer">
        {isUploaded ? (
          <p>Uploaded</p>
        ) : (
          <FileUp
            strokeWidth={1}
            className="h-20 w-20"
            onClick={() => ref.current?.click()}
          />
        )}
      </div>
    </div>
  );
}

export default SongUpload;
