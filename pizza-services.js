export default function pizzaServices(pool) {

  async function getPizzaInfo() {
    const results = await pool.query('SELECT * FROM pizzas');
    return results.rows;
  }

  return {
    getPizzaInfo,
  }
}