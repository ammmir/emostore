# emostore

## Prerequisites

* [node.js](https://nodejs.org/en/)

## How to Run

After checking out the source code, run `npm install` to install all the dependencies, followed by `node app.js`, after which you should see the following output in your terminal:

    $ node app.js
    Running on port 3000

At this point, point your browser to [http://localhost:3000](http://localhost:3000)

## View Completed Orders

When payments are completed, the PaymentIntent JSON object will be appended to the `orders.txt` file in the current directory. You can also visit [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders) to see all successful charges directly fetched from the Stripe API.
