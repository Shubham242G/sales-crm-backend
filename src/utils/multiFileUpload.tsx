import { generateFilePath } from "@/services/urls.service";
import React, { useEffect, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
// import BASE_URL, { generateFilePath } from "@/services/url.service";

interface MultiFileUploadProps {
  onFileChange: (files: { value: string }[]) => void;
  accept?: string;
  label?: string;
  value?: { value: string }[];
}


const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB in bytes

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  onFileChange,
  value,
  accept = "image/*",
  label = "Upload Image",
}) => {
  const [error, setError] = useState<string | null>(null);


  const getBase64 = (file: File, cb: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => cb(reader.result as string);
    reader.onerror = (error) => console.error("Error converting file:", error);
  };

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles: any[] = [];
    const filePromises = selectedFiles.map(
      (file) =>
        new Promise<void>((resolve) => {
          if (file.size > MAX_FILE_SIZE) {
            setError(`File ${file.name} exceeds the maximum allowed size of 25 MB.`);
            resolve();
            return;
          }

          getBase64(file, (result) => {
            const filePath = generateFilePath(file.name);
            newFiles.push({ preview: result });
            resolve();
          });
        })
    );

    await Promise.all(filePromises);

    let finalArr: any = []


    if (value && value.length > 0) {
      finalArr = [...value, ...newFiles.map(({ preview }) => ({
        value: preview,
      }))]
    }
    else {
      finalArr = [
        ...newFiles.map(({ preview }) => ({
          value: preview,
        }))
      ]
    }
    onFileChange(finalArr);
  };

  const handleRemoveFile = (index: number) => {
    if (value && value.length > 0) {
      const updatedFiles: any = value.filter((_, i) => i !== index);
      console.log(updatedFiles, "updatedFiles")

      onFileChange(
        updatedFiles.map(({ value }: any) => ({
          value: value,
        }))
      );
    }
  };
  console.log(value, "valuevaluevaluevaluevaluevaluevalue")

  return (
    <div className="file-upload-container">
      {label && <label className="file-upload-label">{label}</label>}

      {error && <p className="file-upload-error">{error}</p>}
      <div className="file-preview-container">
        {value && value.map((fileObj: any, index: number) => (
          <div key={index} className="file-preview-box">
            <img
              src={
                fileObj && fileObj.value && fileObj.value.includes("base64")
                  ? fileObj.value
                  : generateFilePath(fileObj?.value)
              }
              alt="Preview"
              className="file-preview-image"
              width={100}
              height={100}
            />
            <button
              className="file-remove-btn"
              onClick={() => handleRemoveFile(index)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="file-upload-input-container">
        <div className="file-upload-placeholder">
          <MdOutlineFileUpload className="file-upload-icon" />
          <p className="file-upload-text">
            Maximum upload file size 25 MB, allowed files: JPG, PNG
            <span className="required">*</span>
          </p>
        </div>
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelection}
          className="file-upload-input"
        />
      </div>
    </div>
  );
};

export default MultiFileUpload;
