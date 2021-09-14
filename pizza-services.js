export default function pizzaServices(pool) {

  async function getPizzaInfo() {
    const results = await pool.query('SELECT * FROM pizzas');
    return results.rows;
  }

  async function getPrice(size) {
    const results = await pool.query('SELECT price FROM pizzas WHERE size = $1', [size])
    return results.rows[0].price;
  }

  return {
    getPizzaInfo,
    getPrice
  }
}