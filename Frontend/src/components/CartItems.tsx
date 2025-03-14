import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";



type CartItemProps = {
  cartItem: any;
  // incrementHandler: (cartItem: CartItem) => void;
  // decrementHandler: (cartItem: CartItem) => void;
  // removeHandler: (id: string) => void;
};
const CartItems=({cartItem}:CartItemProps)=> {
  const { photo,productId,name,price,quantity }=cartItem

         
  // const { photo, productId, name, price, quantity } = cartItem;
  return (
    <div className="cart-item">
    <img src={photo} alt={name} />
    <article>
      <Link to={`/product ${productId}`}>camera</Link>
      <span>₹{price}</span>
    </article>

    <div>
      <button >-</button>
      <p>{quantity}</p>
      <button >+</button>
    </div>

    <button >
      <FaTrash />
    </button>
  </div>
  )
}

export default CartItems