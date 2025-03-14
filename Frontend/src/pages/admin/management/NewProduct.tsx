import { useState, ChangeEvent } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";

interface ProductState {
  name: string;
  price: number | "";
  stock: number | "";
  photo: string | null;
}

const NewProduct = () => {
  const [product, setProduct] = useState<ProductState>({
    name: "",
    price: "",
    stock: "",
    photo: null,
  });

  // Handles file upload
  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setProduct((prev) => ({ ...prev, photo: result }));
      }
    };
  };

  // Handles image URL input
  const changeImageURLHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setProduct((prev) => ({ ...prev, photo: e.target.value }));
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form>
            <h2>New Product</h2>
            
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={product.name}
                onChange={(e) => setProduct((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={product.price}
                onChange={(e) => setProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
              />
            </div>

            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={product.stock}
                onChange={(e) => setProduct((prev) => ({ ...prev, stock: Number(e.target.value) }))}
              />
            </div>

            <div>
              <label>Upload Image</label>
              <input type="file" onChange={changeImageHandler} />
            </div>

            <div>
              <label>Or Enter Image URL</label>
              <input
                type="text"
                placeholder="Image URL"
                onChange={changeImageURLHandler}
              />
            </div>

            {product.photo && <img src={product.photo} alt="New Product" style={{ maxWidth: "200px", marginTop: "10px" }} />}

            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
