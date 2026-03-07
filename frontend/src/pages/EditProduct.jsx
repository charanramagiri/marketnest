import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";

const BACKEND_ORIGIN = "http://localhost:5000";
const MAX_IMAGES = 5;

const INITIAL_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  status: "draft",
};

function resolveImageUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${BACKEND_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;
}

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwnedProduct = async () => {
      setIsLoading(true);
      setError("");

      try {
        const token = getToken();
        const res = await axios.get("http://localhost:5000/api/products/my?scope=all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const products = Array.isArray(res.data) ? res.data : [];
        const product = products.find((item) => item._id === id);

        if (!product) {
          setError("Product not found or you are not authorized to edit it.");
          return;
        }

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: String(product.price ?? ""),
          category: product.category || "",
          status: product.status || "draft",
        });

        setExistingImages(Array.isArray(product.images) ? product.images : []);
      } catch (fetchError) {
        console.error("Failed to load product for editing", fetchError);
        setError(fetchError.response?.data?.message || "Unable to load product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnedProduct();
  }, [id]);

  const activeExistingImages = useMemo(
    () => existingImages.filter((image) => !removedImages.includes(image)),
    [existingImages, removedImages]
  );

  const totalImagesAfterSave = activeExistingImages.length + newImages.length;

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const toggleExistingImage = (imageUrl) => {
    setRemovedImages((prev) => (
      prev.includes(imageUrl)
        ? prev.filter((url) => url !== imageUrl)
        : [...prev, imageUrl]
    ));
  };

  const handleNewImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    setError("");

    if (activeExistingImages.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images are allowed per product.`);
      const allowed = Math.max(0, MAX_IMAGES - activeExistingImages.length);
      setNewImages(files.slice(0, allowed));
      return;
    }

    setNewImages(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      if (totalImagesAfterSave > MAX_IMAGES) {
        setError(`Maximum ${MAX_IMAGES} images are allowed per product.`);
        return;
      }

      const token = getToken();
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("category", formData.category);
      payload.append("status", formData.status);
      payload.append("keepExistingImages", JSON.stringify(activeExistingImages));

      newImages.forEach((file) => {
        payload.append("images", file);
      });

      await axios.put(`http://localhost:5000/api/products/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product updated successfully");
      navigate("/dashboard");
    } catch (submitError) {
      console.error("Failed to update product", submitError);
      setError(submitError.response?.data?.message || "Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="page-shell">
        <div className="card state-card">
          <p className="text-muted">Loading product details...</p>
        </div>
      </section>
    );
  }

  if (error && !formData.name) {
    return (
      <section className="page-shell">
        <div className="card state-card">
          <h2>Unable to Edit Product</h2>
          <p className="error-text">{error}</p>
          <Link className="btn btn-primary" to="/dashboard">
            Back to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <header className="hero">
        <div>
          <h1 className="title-xl">Edit Product</h1>
          <p className="text-muted">Update details and manage product images.</p>
        </div>
        <Link className="btn btn-soft" to="/dashboard">
          Back to Dashboard
        </Link>
      </header>

      <form className="card create-form edit-form-card" onSubmit={handleSubmit}>
        <div className="create-grid">
          <div>
            <label className="field-label" htmlFor="name">Product Name</label>
            <input id="name" className="input" type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <label className="field-label" htmlFor="category">Category</label>
            <input id="category" className="input" type="text" name="category" value={formData.category} onChange={handleChange} required />
          </div>

          <div>
            <label className="field-label" htmlFor="price">Price (INR)</label>
            <input id="price" className="input" type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          <div>
            <label className="field-label" htmlFor="status">Status</label>
            <select id="status" className="select" name="status" value={formData.status} onChange={handleChange}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="span-2">
            <label className="field-label" htmlFor="description">Description</label>
            <textarea id="description" className="textarea" name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="span-2 edit-image-section">
            <label className="field-label">Existing Images</label>
            <p className="text-muted image-help-text">Toggle images to remove or keep them before saving.</p>

            {existingImages.length === 0 ? (
              <p className="text-muted">No existing images.</p>
            ) : (
              <div className="edit-image-grid">
                {existingImages.map((imageUrl, index) => {
                  const isRemoved = removedImages.includes(imageUrl);

                  return (
                    <div key={`${imageUrl}-${index}`} className={`edit-image-item ${isRemoved ? "removed" : ""}`}>
                      <img src={resolveImageUrl(imageUrl)} alt={`Existing ${index + 1}`} />
                      <button
                        type="button"
                        className={`btn ${isRemoved ? "btn-success" : "btn-danger"}`}
                        onClick={() => toggleExistingImage(imageUrl)}
                      >
                        {isRemoved ? "Keep" : "Remove"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="span-2">
            <label className="field-label" htmlFor="images">Add New Images</label>
            <p className="text-muted image-help-text">
              You can keep at most {MAX_IMAGES} images total. Current selected total: {totalImagesAfterSave}
            </p>
            <input id="images" className="file-input" type="file" multiple onChange={handleNewImageChange} />

            {newImages.length > 0 && (
              <ul className="file-list">
                {newImages.map((file) => (
                  <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {error && <p className="error-text edit-error">{error}</p>}

        <div className="edit-form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" className="btn btn-soft" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditProduct;
