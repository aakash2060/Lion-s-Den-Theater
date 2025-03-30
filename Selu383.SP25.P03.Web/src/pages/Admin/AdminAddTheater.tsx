import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theaterService, TheaterDto } from "../../services/api";

const AdminAddTheater = () => {
  const [form, setForm] = useState<TheaterDto>({
    name: "",
    address: "",
    seatCount: 0,
    managerId: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "seatCount" || name === "managerId" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = "Name is required.";
    if (!form.address) errs.address = "Address is required.";
    if (form.seatCount <= 0) errs.seatCount = "Seat count must be greater than 0.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await theaterService.create(form);
      navigate("/admin-manage-theaters");
    } catch (err: any) {
      alert(err?.response?.data || "Failed to create theater.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-800 rounded-xl shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Theater</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white rounded"
            placeholder="Theater Name"
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
            placeholder="123 Main St"
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
            placeholder="100"
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
            placeholder="Manager User ID"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Theater
        </button>
      </form>
    </div>
  );
};

export default AdminAddTheater;