import CartTable from "./CartTable";
import { getMyCart } from "@/lib/actions/cart.actions";

export const metadata = {
    title: "Shoping Cart"
}

const Cart = async() => {
    const cart = await getMyCart();
    return ( <><CartTable cart={cart}  /></> );
}
 
export default Cart;