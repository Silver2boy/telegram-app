const { Telegraf } = require('telegraf');
const express = require('express');
const axios = require('axios');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const app = express();

// پیام خوش‌آمدگویی
bot.start((ctx) => {
  ctx.reply('سلام! به ربات من خوش آمدید 🌟');
});

// دستور پرداخت
bot.command('pay', async (ctx) => {
  const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
  const amount = 10000; // مبلغ به تومان
  const description = 'خرید محصول تستی';
  const callback_url = `${process.env.APP_URL}/verify`;

  try {
    const response = await axios.post('https://api.zarinpal.com/pg/v4/payment/request.json', {
      merchant_id: ZARINPAL_MERCHANT_ID,
      amount,
      description,
      callback_url,
    });

    const { authority, link } = response.data.data;
    ctx.reply(`برای پرداخت به لینک زیر بروید:\n${link}`);
  } catch (error) {
    console.error(error);
    ctx.reply('خطایی در ایجاد پرداخت رخ داد.');
  }
});

// تنظیم وب‌هوک تلگرام
app.use(bot.webhookCallback('/bot'));
bot.telegram.setWebhook(`${process.env.APP_URL}/bot`);

// سرور HTTP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`سرور در حال اجرا است روی پورت ${PORT}`);
});
