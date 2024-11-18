import React, { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";

interface FileUploadProps {
  onFileChange: (files: { mimeType: string; value: string }[]) => void;
  accept?: string;
  label?: string;
}

interface FilePreview {
  file: File;
  preview: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  accept = "image/*", // Default to accept images only
  label = "Upload Image",
}) => {
  const [files, setFiles] = useState<FilePreview[]>([]); // Store multiple files with previews

  // Convert file to base64
  const getBase64 = (file: File, cb: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => cb(reader.result as string);
    reader.onerror = (error) => console.error("Error converting file:", error);
  };

  // Handle multiple file selection
  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles: FilePreview[] = [];

    selectedFiles.forEach((file) => {
      getBase64(file, (result) => {
        newFiles.push({ file, preview: result });
        if (newFiles.length === selectedFiles.length) {
          setFiles((prevFiles) => [...prevFiles, ...newFiles]);
          onFileChange(
            newFiles.map(({ file, preview }) => ({
              mimeType: file.type,
              value: `${file.name}@@${preview}`,
            }))
          );
        }
      });
    });
  };

  // Remove file and its preview
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="file-upload-container">
      {label && (
        <label className="mb-3 block text-sm font-medium text-black">
          {label}
        </label>
      )}

      {/* Preview selected files */}
      <div className="flex gap-4 mt-4 flex-wrap">
        {files.map((fileObj, index) => (
          <div
            key={index}
            className="relative w-24 h-24 border rounded overflow-hidden"
          >
            <img
              src={fileObj.preview}
              alt="Preview"
              className="object-cover w-full h-full"
            />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              onClick={() => handleRemoveFile(index)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* File upload input */}
      <div className="relative mt-4">
        <div className="mid_content w-full h-[100%] bg-white border border-[#e5e5e5] absolute top-0 text-center flex flex-col items-center justify-center">
          <MdOutlineFileUpload className="text-graytext text-2xl" />
          <p className="text-graytext text-[0.75rem] mt-1">
            Maximum upload file size 25 MB, allowed files: JPG, PNG
            <span className="text-red-500">*</span>
          </p>
        </div>
        <input
          type="file"
          multiple // Allow multiple file selection
          accept={accept}
          onChange={handleFileSelection}
          className="appearance-none opacity-0 w-full h-[85px] cursor-pointer"
        />
      </div>
    </div>
  );
};

export default FileUpload;
