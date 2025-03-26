import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const totalAmount = cart.reduce((acc, item) => acc + item.cost, 0);

  return (
    <div className='container mt-5 mb-5'>
      <h2 className='fw-bold text-center'>YOUR CART</h2>

      <div>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul className="list-group">
            {cart.map((item: CartItem) => (
              // NOTE: THIS IS ONE OF THE NEW BOOTSTRAP ITEMS I USED; IT IS A NEW FORMAT OF A LIST
              <li key={item.bookID} className='list-group-item'> 
                <h3 className='display-4'>{item.title}</h3>
                <h5>By {item.author}</h5>
                <p className='text-end h4'>Price: <strong>${item.cost.toFixed(2)}</strong></p>
                <p className='text-end h6'>Quantity: {item.quantity}</p>
                <button onClick={() => removeFromCart(item.bookID, 1)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <br /><br />
      <h3 className='text-end'>Total Cost: <strong>${totalAmount.toFixed(2)}</strong></h3>
      <br /><br />
      <button onClick={() => navigate('/')}>Continue Browsing</button>
    </div>
  );
}
