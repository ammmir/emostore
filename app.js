const crypto = require('crypto');

const express = require('express');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const stripe = require('stripe')('sk_test_NZvHy78b8TtDnL2xDIKYVwyH00vAYtnSS4');

const products = require('./products');

const app = express();
app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'supersecure',
  name: 'SID'
}));
app.engine('.hbs', expressHandlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.get('/', async (req, res) => {
  const price = await products.price();

  res.render('products', { products: await products.list(), price: price / 100 });
});

app.get('/checkout', async (req, res) => {
  // start checkout flow, generate unique idempotency key
  const cartId = crypto.randomBytes(16).toString('hex');
  req.session['cart'] = cartId;

  const price = await products.price();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: 'usd',
    payment_method_types: ['card'],
    metadata: {
      integration_check: 'accept_a_payment',
      emoji: req.query.emoji, // UTF-8!
    },
  }, {
    idempotencyKey: cartId,
  });

  res.render('checkout', { emoji: req.query.emoji, price: price / 100, client_secret: paymentIntent.client_secret });
});

app.get('/confirmation', async (req, res) => {
  res.render('confirmation');
});

app.get('/admin/orders', async (req, res) => {
  // instead of reading from a local file or database, let's just query Stripe for the orders to be fulfilled
  // obviously, there's a limit of 100 charges (successful or not), so this is only viable for this demo :)
  let charges = await stripe.charges.list(
    { limit: 100 },
  );

  // prune invalid charges
  charges = charges.data.filter(charge => charge.status == 'succeeded');

  // modify the charges object to make rendering easier
  charges = charges.map((charge) => {
    return { ...charge, order_date: new Date(charge.created * 1000), amount_text: charge.amount / 100 };
  });

  res.render('admin-orders', { charges: charges });
});

app.listen(3000, () => {
  console.log('Running on port 3000');
});
