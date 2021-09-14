import session from 'express-session';

export default function pizzaRoutes(pizzaServices) {
  async function indexRoute(req, res) {
    const products = await pizzaServices.getPizzaInfo();
    let items = undefined;
    let total = undefined;
    if (req.session.cart != undefined) {
      items = req.session.cart;
      total = items.reduce((total, item) => {
        console.log(item);
        return total + item.qty * item.price;
      }, 0);
      total = total.toFixed(2);
    }

    res.render('index', {
      products: products,
      item: items,
      total: total,
    });
  }

  async function addToCart(req, res) {
    const thisSize = req.params.size;
    let thisPrice = await pizzaServices.getPrice(thisSize);
    thisPrice = parseFloat(thisPrice);

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const cart = req.session.cart;

    const itemIndex = cart.findIndex((item) => {
      return item.size == thisSize;
    });

    if (itemIndex == -1) {
      cart.push({
        size: thisSize,
        qty: 1,
        price: thisPrice,
        cost: thisPrice.toFixed(2),
      });
    } else {
      cart[itemIndex].qty++;
      const thisCost = cart[itemIndex].qty * cart[itemIndex].price;
      cart[itemIndex].cost = thisCost.toFixed(2);
    }
    res.redirect('/');
  }

  async function removeFromCart(req, res) {
    const thisSize = req.params.size;
    const cart = req.session.cart;
    const itemIndex = cart.findIndex((item) => {
      return item.size == thisSize;
    });
    cart[itemIndex].qty--;
    if (cart[itemIndex].qty == 0) {
      cart.splice(itemIndex);
    } else {
      const thisCost = cart[itemIndex].qty * cart[itemIndex].price;
      cart[itemIndex].cost = thisCost.toFixed(2);
    }
    res.redirect('/');
  }

  async function checkOut(req, res) {
    const cart = req.session.cart;
    let thisTotal = cart.reduce((total, item) => {
      return total + item.qty * item.price;
    }, 0);
    thisTotal = thisTotal.toFixed(2);
    if (!req.session.orders) {
      req.session.orders = [];
      const thisOrder = {
        id: 1,
        cost: thisTotal,
        status: 'payment due',
        action: 'pay',
      };
      req.session.orders.push(thisOrder);
    } else {
      const orders = req.session.orders;
      console.log(orders);
      let previousID = orders.reduce((max, order) => {
        if (order.id >= max) {
          return order.id;
        }
      }, 0);
      console.log(previousID);
      let orderID = previousID + 1;
      console.log(orderID);
      const thisOrder = {
        id: orderID,
        cost: thisTotal,
        status: 'payment due',
        action: 'pay',
      };
      orders.push(thisOrder);
    }
    delete req.session.cart;
    console.log(req.session.orders);
    res.redirect('/');
  }

  async function ordersRoute(req, res) {
    res.render('orders', {
      order: req.session.orders,
    });
  }

  async function updateStatus(req, res) {
    const orders = req.session.orders;
    const id = req.params.id;
    const action = req.params.action;
    const next = {
      pay: {
        status: 'paid',
        action: 'collect'
      },
      collect: {
        status: 'collected',
        action: undefined
      }
    }
    const orderIndex = orders.findIndex((order) => {
      return order.id == id;
    });
    orders[orderIndex].status = next[action].status;
    orders[orderIndex].action = next[action].action;

    res.redirect('/orders')
  }

  return {
    indexRoute,
    addToCart,
    removeFromCart,
    ordersRoute,
    checkOut,
    updateStatus
  };
}
