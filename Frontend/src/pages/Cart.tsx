import {  useState } from "react";
import { Link } from "react-router-dom";
import CartItems from "../components/CartItems"


const cartItems=[

  {
    productId:"faiehfhf",
    photo:"hefijhijfijfijfj",
    name:"camera",
    price:3000,
    quantity:"4",
    stock:10,
  }




]
const subtotal=4000
const tax=Math.round(subtotal*0.18);
const shippingCharges=200
const discount=100
const total=subtotal+tax+shippingCharges
const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
    const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
    
  
  return (
    

    
     <div className="cart">
      <main>
      {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItems
              // incrementHandler={incrementHandler}
              // decrementHandler={decrementHandler}
              // removeHandler={removeHandler}
              key={idx}
              cartItem={i}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      

      </main>
      <aside>
      <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>
        
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        
{couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              {/* Invalid Coupon <VscError /> */}
              Error
            </span>
          ))}
         
         {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
     </div>
    
  )
}

export default Cart
