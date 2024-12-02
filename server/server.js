const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { createEmailContent } = require("./html_template");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

// Настройка отправки email
const transporter = nodemailer.createTransport({
  service: "Mail.ru",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Генерация ключей
const generateKeys = (games) =>
  games.map((game) => ({
    name: game.name,
    key: uuidv4(),
  }));

// Обработка платежа
app.post("/checkout", async (req, res) => {
  const { email, games } = req.body;
  if (!email || !games) {
    return res.status(400).send({ message: "Неверные данные" });
  }

  const keys = generateKeys(games);
  const emailContent = createEmailContent(keys);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Ваши ключи, купленные на E-SHOP!",
      html: emailContent,
    });

    res.status(200).send({ message: "Покупка успешна, ключи отправлены" });
  } catch (error) {
    console.error("Ошибка при отправке письма:", error);
    res.status(500).send({ message: "Ошибка при отправке письма" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT}`);
});
