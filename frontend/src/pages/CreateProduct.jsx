import { useState } from "react";
import axios from "axios";

function CreateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    status: "published"
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 5) {
      setError("You can upload a maximum of 5 images.");
      setImages(selectedFiles.slice(0, 5));
      return;
    }

    setError("");
    setImages(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      if (images.length > 5) {
        setError("You can upload a maximum of 5 images.");
        return;
      }

      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("status", formData.status);

      for (let i = 0; i < images.length; i += 1) {
        data.append("images", images[i]);
      }

      const res = await axios.post(
        "http://localhost:5000/api/products",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Product created successfully");
      console.log(res.data);
    } catch (error) {
      console.error("Product creation failed", error);
      setError(error.response?.data?.message || "Product creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-shell">
      <header className="hero">
        <div>
          <h1 className="title-xl">Create Product</h1>
          <p className="text-muted">Add complete product details and upload images for listing.</p>
        </div>
      </header>

      <form className="card create-form" onSubmit={handleSubmit}>
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

          <div className="span-2">
            <label className="field-label" htmlFor="images">Product Images</label>
            <p className="text-muted image-help-text">Upload up to 5 images.</p>
            <input id="images" className="file-input" type="file" multiple onChange={handleImageChange} />

            {images.length > 0 && (
              <ul className="file-list">
                {images.map((file) => (
                  <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {error && <p className="error-text edit-error">{error}</p>}

        <div style={{ marginTop: "20px" }}>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateProduct;
