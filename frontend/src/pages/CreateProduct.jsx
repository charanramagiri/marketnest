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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("status", formData.status);

      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }

      const res = await axios.post(
        "http://localhost:5000/api/products",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Product created successfully");

      console.log(res.data);

    } catch (error) {

      console.error("Product creation failed", error);

    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Create Product</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Name</label><br/>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <br/>

        <div>
          <label>Description</label><br/>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <br/>

        <div>
          <label>Price</label><br/>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <br/>

        <div>
          <label>Category</label><br/>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <br/>

        <div>
          <label>Status</label><br/>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <br/>

        <div>
          <label>Images</label><br/>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
          />
        </div>

        <br/>

        <button type="submit">Create Product</button>

      </form>
    </div>
  );
}

export default CreateProduct;