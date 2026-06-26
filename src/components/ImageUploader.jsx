import { useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { api, getErrorMessage } from "../lib/api";

export default function ImageUploader({ value, onChange, label = "Upload image" }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("image", file);
    setUploading(true);
    try {
      const response = await api.post("/uploads/image", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onChange(response.data.data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(getErrorMessage(error, "Image upload failed"));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="image-uploader">
      <label className="upload-box">
        {value ? <img src={value} alt="Uploaded preview" /> : <ImagePlus size={28} />}
        <span>{uploading ? "Uploading..." : label}</span>
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
        {uploading && <LoaderCircle className="spin upload-spinner" size={24} />}
      </label>
    </div>
  );
}
