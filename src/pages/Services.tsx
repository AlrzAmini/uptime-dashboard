import { useEffect, useState } from "react";
import {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
} from "../services/monitoredServices";
import ServiceCard from "../components/ServiceCard";
import CustomLoading from "../components/CustomLoading";

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    type: "",
    environment: "",
    expectedResponseTimeMs: 1000,
    ownerTeam: "",
    contactEmail: "",
    projectName: "",
    maxAllowedDowntimePerMonth: "",
    checkInterval: "",
    tags: [""],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [loading, setLoading] = useState(false);

  async function loadServices() {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setLoading(false);
    }
  }

  function validateForm() {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.url.trim()) newErrors.url = "URL is required";
    return newErrors;
  }

  async function openEditModal(id: string) {
    try {
      const service = await getServiceById(id);
      setFormData({
        name: service.name || "",
        url: service.url || "",
        description: service.description || "",
        type: service.type || "",
        environment: service.environment || "",
        expectedResponseTimeMs: service.expectedResponseTimeMs || 1000,
        ownerTeam: service.ownerTeam || "",
        contactEmail: service.contactEmail || "",
        projectName: service.projectName || "",
        maxAllowedDowntimePerMonth: service.maxAllowedDowntimePerMonth || "",
        checkInterval: service.checkInterval || "",
        tags: service.tags && service.tags.length > 0 ? service.tags : [""],
      });
      setEditingServiceId(id);
      setEditMode(true);
      setFormVisible(true);
      setErrors({});
      setSuccessMessage("");
    } catch (error) {
      console.error("Failed to load service for edit", error);
    }
  }

  async function handleSubmit() {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      if (editMode && editingServiceId) {
        await updateService(editingServiceId, {
          ...formData,
          isActive: true,
          description: formData.description || null,
          type: formData.type || null,
          environment: formData.environment || null,
          ownerTeam: formData.ownerTeam || null,
          contactEmail: formData.contactEmail || null,
          projectName: formData.projectName || null,
          maxAllowedDowntimePerMonth:
            formData.maxAllowedDowntimePerMonth || null,
          checkInterval: formData.checkInterval || null,
          tags: formData.tags.filter((t) => t.trim()),
        });
        setSuccessMessage("✅ Service updated successfully!");
      } else {
        await createService({
          ...formData,
          isActive: true,
          description: formData.description || null,
          type: formData.type || null,
          environment: formData.environment || null,
          ownerTeam: formData.ownerTeam || null,
          contactEmail: formData.contactEmail || null,
          projectName: formData.projectName || null,
          maxAllowedDowntimePerMonth:
            formData.maxAllowedDowntimePerMonth || null,
          checkInterval: formData.checkInterval || null,
          tags: formData.tags.filter((t) => t.trim()),
        });
        setSuccessMessage("✅ Service created successfully!");
      }

      setFormVisible(false);
      setEditMode(false);
      setEditingServiceId(null);
      setFormData({
        name: "",
        url: "",
        description: "",
        type: "",
        environment: "",
        expectedResponseTimeMs: 1000,
        ownerTeam: "",
        contactEmail: "",
        projectName: "",
        maxAllowedDowntimePerMonth: "",
        checkInterval: "",
        tags: [""],
      });
      loadServices();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        Monitored Services
      </h1>

      <div className="flex flex-wrap gap-4 mb-6">
        

        <>
          <button className="glass-button" onClick={loadServices}>
          🔄 Reload
        </button>
          {loading && <CustomLoading />}
        </>

        <button
          className="glass-button"
          onClick={() => {
            setEditMode(false);
            setFormVisible(true);
            setFormData({
              name: "",
              url: "",
              description: "",
              type: "",
              environment: "",
              expectedResponseTimeMs: 1000,
              ownerTeam: "",
              contactEmail: "",
              projectName: "",
              maxAllowedDowntimePerMonth: "",
              checkInterval: "",
              tags: [""],
            });
            setErrors({});
            setSuccessMessage("");
          }}
        >
          ➕ Add Service
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-500/20 text-green-300 rounded-xl">
          {successMessage}
        </div>
      )}

      {formVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-xl border border-gray-700 overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-white mb-4">
              {editMode ? "Edit Service" : "New Service"}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name}</p>
              )}

              <input
                type="text"
                placeholder="URL"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />
              {errors.url && (
                <p className="text-red-400 text-sm">{errors.url}</p>
              )}

              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />

              <input
                type="text"
                placeholder="Type (optional)"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />

              <input
                type="text"
                placeholder="Environment (optional)"
                value={formData.environment}
                onChange={(e) =>
                  setFormData({ ...formData, environment: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />

              <input
                type="number"
                placeholder="Expected Response Time (ms)"
                value={formData.expectedResponseTimeMs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expectedResponseTimeMs: Number(e.target.value),
                  })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />

              <input
                type="text"
                placeholder="Owner Team (optional)"
                value={formData.ownerTeam}
                onChange={(e) =>
                  setFormData({ ...formData, ownerTeam: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />

              <input
                type="email"
                placeholder="Contact Email (optional)"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />

              <input
                type="text"
                placeholder="Project Name (optional)"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />

              <input
                type="text"
                placeholder="Max Allowed Downtime Per Month (optional)"
                value={formData.maxAllowedDowntimePerMonth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxAllowedDowntimePerMonth: e.target.value,
                  })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />

              <input
                type="text"
                placeholder="Check Interval (optional)"
                value={formData.checkInterval}
                onChange={(e) =>
                  setFormData({ ...formData, checkInterval: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />

              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={formData.tags.join(",")}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value.split(",") })
                }
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="glass-button"
                  onClick={() => {
                    setFormVisible(false);
                    setEditMode(false);
                    setEditingServiceId(null);
                    setErrors({});
                    setSuccessMessage("");
                  }}
                >
                  Cancel
                </button>
                <button className="glass-button" onClick={handleSubmit}>
                  {editMode ? "Update Service" : "Create Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
