import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { theaterService, TheaterDto } from "../../services/api";

const AdminEditTheater = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<TheaterDto | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetch = async () => {
      const data = await theaterService.getById(Number(id));
      setForm(data);
    };
    fetch();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) =>
      prev ? {
        ...prev,
        [name]: name === "seatCount" || name === "managerId" ? Number(value) : value,
      } : null
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form?.name) errs.name = "Name is required.";
    if (!form?.address) errs.address = "Address is required.";
    if (!form?.seatCount || form.seatCount <= 0) errs.seatCount = "Seat count must be > 0.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !validate()) return;
    try {
      await theaterService.update(Number(id), form);
      navigate("/admin-manage-theaters");
    } catch (err: any) {
      alert(err?.response?.data || "Failed to update theater.");
    }
  };

  if (!form) return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 rounded-xl shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Theater</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded"
          />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
        </div>
        <div>
          <label className="block font-medium">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded"
          />
          {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>}
        </div>
        <div>
          <label className="block font-medium">Seat Count</label>
          <input
            name="seatCount"
            type="number"
            value={form.seatCount}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded"
          />
          {errors.seatCount && <p className="text-red-400 text-sm">{errors.seatCount}</p>}
        </div>
        <div>
          <label className="block font-medium">Manager ID (optional)</label>
          <input
            name="managerId"
            type="number"
            value={form.managerId || ""}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminEditTheater;