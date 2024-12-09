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
  const [files, setFiles] = useState<FilePreview[]>([]);

  // Convert file to base64
  const getBase64 = (file: File, cb: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => cb(reader.result as string);
    reader.onerror = (error) => console.error("Error converting file:", error);
  };

  // Handle file selection
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
              value: preview, // Pass only the base64 value
            }))
          );
        }
      });
    });
  };

  // Remove file preview
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="file-upload-container">
      {label && <label className="block mb-3 text-sm font-medium">{label}</label>}

      {/* Preview selected files */}
      <div className="flex gap-4 mt-4 flex-wrap">
        {files.map((fileObj, index) => (
          <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
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

      {/* File input */}
      <div className="relative mt-4">
        <div className="absolute top-0 w-full h-full bg-white border flex items-center justify-center">
          <MdOutlineFileUpload className="text-gray-400 text-2xl" />
          <p className="text-gray-400 text-sm mt-1">Upload JPG or PNG (Max 25MB)</p>
        </div>
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelection}
          className="appearance-none opacity-0 w-full h-[85px] cursor-pointer"
        />
      </div>
    </div>
  );
};

export default FileUpload;
