const createEmailContent = (keys) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #0f0f0f; color: #ecebf9; padding: 20px; border-radius: 10px;">
  <h2 style="color: #c94fc5;">Спасибо за покупку в E-SHOP!</h2>
  <p style="color: #ecebf9;">Ваш заказ успешно обработан. Ниже приведены ключи для приобретенных игр:</p>
  <ul style="list-style-type: none; padding: 0;">
    ${keys
      .map(
        (keyObj) => `
          <li style="margin-bottom: 10px; background-color: #1b1b1b; padding: 10px; border-radius: 5px;">
            <strong style="color: #e574e1;">${keyObj.name}:</strong>
            <span style="color: #979797;">${keyObj.key}</span>
          </li>`
      )
      .join("")}
  </ul>
  <p style="color: #ecebf9;">
    Если у вас возникнут вопросы, пожалуйста, свяжитесь с нашей службой поддержки.
  </p>
  <p style="color: #979797;">С уважением,<br>E-SHOP</p>
</div>
`;

module.exports = { createEmailContent };
