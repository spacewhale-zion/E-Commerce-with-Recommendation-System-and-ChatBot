import { useState, ChangeEvent, FormEvent } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const defaultImg =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";

const ProductManagement = () => {
  const [product, setProduct] = useState({
    name: "Puma Shoes",
    price: 2000,
    stock: 10,
    photo: defaultImg,
  });

  const [productUpdate, setProductUpdate] = useState(product);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setProductUpdate((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProductUpdate((prev) => ({
            ...prev,
            photo: reader.result as string, // Ensuring `photo` is always a string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProduct(productUpdate);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section>
          <strong>ID - asnmdkasndmsan</strong>
          <img src={product.photo} alt="Product" />
          <p>{product.name}</p>
          <span className={product.stock > 0 ? "green" : "red"}>
            {product.stock > 0 ? `${product.stock} Available` : "Not Available"}
          </span>
          <h3>${product.price}</h3>
        </section>

        <article>
          <form onSubmit={handleSubmit}>
            <h2>Manage</h2>
            {["name", "price", "stock"].map((field) => (
              <div key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  required
                  type={field === "name" ? "text" : "number"}
                  placeholder={field}
                  name={field}
                  value={productUpdate[field as keyof typeof productUpdate]}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            <div>
              <label>Photo</label>
              <input required type="file" onChange={handleImageChange} />
            </div>

            {productUpdate.photo && <img src={productUpdate.photo} alt="New Image" />}

            <button type="submit">Update</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default ProductManagement;
