export default function pizzaRoutes(pizzaServices) {

  async function indexRoute(req, res) {
    const products = await pizzaServices.getPizzaInfo();
    console.log(products);
    res.render('index', {
		products:products
	});
  }
  return {
    indexRoute
  }
}