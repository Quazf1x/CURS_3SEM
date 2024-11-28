import InputGroup from "./InputGroup";
import { motion } from "framer-motion";
import { paymentModalVariants } from "../../helpers/motionConstants";
import { useState, useContext } from "react";
import { CartContext } from "../Providers/CartProvider";

type paymentModalTypes = {
  totalPrice: string;
  toggleModal: () => void;
};

type formDataType = {
  name: string;
  value: FormDataEntryValue;
};

const PaymentModal = ({ totalPrice, toggleModal }: paymentModalTypes) => {
  const inputData = [
    {
      id: "payment-email",
      pattern: undefined,
      replacementPattern: "",
      replacementPatternSpacing: "",
      type: "email",
      label: "E-Mail",
      placeholder: "example@examp.le",
      isRequired: true,
      maxLength: undefined,
      minLength: undefined,
    },
    {
      id: "payment-creditNumber",
      pattern: "[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}",
      replacementPattern: /(\d{4})(?=\d)/,
      replacementPatternSpacing: "$1 ",
      type: "unset",
      label: "Credit card number",
      placeholder: "____ ____ ____ ____",
      isRequired: true,
      maxLength: 19,
      minLength: 19,
    },
    {
      id: "payment-creditDate",
      pattern: "[0-9]{2}/[0-9]{2}",
      replacementPattern: /(\d{2})(?=\d)/,
      replacementPatternSpacing: "$1/",
      type: "unset",
      label: "Credit card exp. date",
      placeholder: "__/__",
      isRequired: true,
      maxLength: 5,
      minLength: 5,
    },
    {
      id: "payment-creditCVV",
      pattern: "[0-9]{3}",
      replacementPattern: "unset",
      replacementPatternSpacing: "unset",
      type: "password",
      label: "CVV",
      placeholder: "___",
      isRequired: true,
      maxLength: 3,
      minLength: 3,
    },
  ];

  const [isPayment, setPayment] = useState(true);
  const { cartList, setCartList } = useContext(CartContext);

  const sendDataToBackend = async (formData: formDataType[]) => {
    const emailData = formData.find((inputFieldData) => {
      return inputFieldData.name == "input-payment-email";
    });
    try {
      if (emailData == undefined) throw new Error("email is undefined.");

      const response = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailData.value,
          games: cartList,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных на сервер");
      }

      setPayment(false);
      setCartList([]);
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const formValues: formDataType[] = [];

    for (const [key, value] of formData.entries()) {
      const newFormEntry = { name: key, value: value };
      formValues.push(newFormEntry);
    }

    sendDataToBackend(formValues);
    event.preventDefault();
  };

  const modalContent = isPayment ? (
    <form onSubmit={onFormSubmit} className="payment-form">
      {inputData.map((input, i) => {
        return (
          <InputGroup
            key={`input-${i}-${input.type}`}
            type={input.type}
            label={input.label}
            placeholder={input.placeholder}
            isRequired={input.isRequired}
            id={input.id}
            maxLength={input.maxLength}
            minLength={input.minLength}
            pattern={input.pattern}
            replacementPattern={input.replacementPattern}
            replacementPatternSpacing={input.replacementPatternSpacing}
          />
        );
      })}
      <button className="payment-submit-btn" type="submit">
        Total: {totalPrice} $
      </button>
      <button onClick={toggleModal} className="payment-cancel-btn" type="reset">
        Cancel
      </button>
    </form>
  ) : (
    <div className="payment-afterword-wrapper">
      <h1>Покупка успешна!</h1>
      <p>
        Проверьте указанную вами почту, в ближайшее время на нее придет письмо с
        купленными ключами!
      </p>
      <button className="payment-afterword-button" onClick={toggleModal}>
        Ок
      </button>
    </div>
  );

  return (
    <motion.div
      initial={paymentModalVariants.initial}
      animate={paymentModalVariants.animate}
      transition={paymentModalVariants.transition}
      exit={paymentModalVariants.exit}
      className="payment-modal-bg"
    >
      <div className="payment-modal">{modalContent}</div>
    </motion.div>
  );
};

export default PaymentModal;
