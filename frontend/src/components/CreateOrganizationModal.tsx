import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { X } from "lucide-react";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setLogo(preview);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      if (logo) formData.append("logo", logo);

      await axios.post("http://localhost:5000/api/organizations", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setName("");
      setSlug("");
      setLogo(null);
      setPreview(null);
      setLoading(false);
      onCreated && onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4">
      <div className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-5 transition-transform transform scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create Organization
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-1">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-700 dark:text-gray-300 rounded-md"
            />
            <p className="text-xs opacity-70 mt-1">
              Recommended size 1:1, up to 10MB.
            </p>
            {preview && (
              <img
                src={preview}
                alt="Logo Preview"
                className="mt-3 w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
              />
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Organization name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Slug</label>
            <input
              type="text"
              placeholder="my-org"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Organization"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
