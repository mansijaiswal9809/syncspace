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
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = { name, slug, logo: "https://example.com/logo.png" };

      await axios.post("http://localhost:5000/api/organizations", formData, {
        withCredentials: true,
      });

      setName("");
      setSlug("");
      setLogo(null);
      setLoading(false);
      onCreated && onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-[#ffffff9a] dark:bg-[#0000007b] text-gray-900 dark:text-white">

      <div className="relative w-full max-w-md mx-auto rounded-2xl p-8 transition duration-150 cursor-pointer shadow-2xl bg-gray-50 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Organization
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 dark:text-gray-300"
            />
            <p className="text-xs opacity-70 mt-1">
              Recommended size 1:1, up to 10MB.
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Organization name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700"
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Organization"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
