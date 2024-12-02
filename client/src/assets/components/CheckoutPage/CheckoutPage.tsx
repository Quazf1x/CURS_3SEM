import Header from "../Header/Header.tsx";
import OrderedGame from "./OrderedGame.tsx";
import PaymentModal from "./PaymentModal.tsx";
import OrderType from "./OrderType.ts";
import { CartContext } from "../Providers/CartProvider.tsx";
import { pageTransitionMotion } from "../../helpers/motionConstants.ts";
import { AnimatePresence, motion } from "framer-motion";

import { useState, useEffect, useContext, useMemo } from "react";

const CheckoutPage = () => {
  const { cartList } = useContext(CartContext);
  const [isPayment, setPayment] = useState(false);

  const togglePaymentModal = () => {
    setPayment(!isPayment);
  };

  const ordersContent =
    cartList.length == 0 ? (
      <h2 className="empty-cart">You don't have any items in the cart.</h2>
    ) : (
      cartList.map((order: OrderType) => {
        return (
          <OrderedGame
            key={`key-${order.name}`}
            name={order.name}
            price={order.price}
          />
        );
      })
    );

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartList));
  }, [cartList]);

  const totalPrice = useMemo(() => {
    return cartList
      .reduce((totalSum, currentProduct) => totalSum + currentProduct.price, 0)
      .toFixed(2);
  }, [cartList]);

  return (
    <motion.div
      initial={pageTransitionMotion.initial}
      animate={pageTransitionMotion.animate}
      transition={pageTransitionMotion.transition}
      exit={pageTransitionMotion.exit}
    >
      <AnimatePresence>
        {isPayment && (
          <PaymentModal
            totalPrice={totalPrice}
            toggleModal={togglePaymentModal}
          />
        )}
      </AnimatePresence>
      <Header />
      <main className="checkout-banner">
        <h1 className="checkout-slide-right">Checkout</h1>
        <ul className="order-list checkout-slide-right">{ordersContent}</ul>
        <div className="confirm-order-wrapper checkout-slide-left">
          <h2>
            Total: <span>${totalPrice}</span>
          </h2>
          <button
            onClick={() => {
              if (cartList.length > 0) togglePaymentModal();
            }}
          >
            Buy
          </button>
        </div>
      </main>
    </motion.div>
  );
};

export default CheckoutPage;
