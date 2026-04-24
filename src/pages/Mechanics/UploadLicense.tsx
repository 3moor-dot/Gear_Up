import { useState } from "react";

const UploadLicense = () => {
  const [file, setFile] = useState<File | null>(null);
  const userId = localStorage.getItem("pendingMechanicId");

  const handleUpload = async () => {
    const formData = new FormData();

    formData.append("UserId", userId!);
    formData.append("File", file!);
    formData.append("IsWorkshopLicense", "true");

    const res = await fetch(
      "https://gearupapp.runasp.net/api/mechanics/documents",
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.ok) {
      localStorage.removeItem("pendingMechanicId");
      window.location.href = "/login";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">ارفع رخصة الورشة</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        رفع الترخيص
      </button>
    </div>
  );
};

export default UploadLicense;