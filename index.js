'use strict';
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import pg from 'pg';
import pizzaServices from './pizza-services.js';
import pizzaRoutes from './pizza-routes.js';

const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/pizza_database';

const pool = (() => {
  if (process.env.NODE_ENV !== 'production') {
    return new Pool({
      connectionString: connectionString,
      ssl: false,
    });
  } else {
    return new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
})();

pool.connect();
const services = pizzaServices(pool);
const routes = pizzaRoutes(services);

const app = express();
const PORT =  process.env.PORT || 3017;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(
    session({
      secret: 'Or four and hoard them in my inventory',
      resave: false,
      saveUninitialized: true,
    }),
);

app.get('/', routes.indexRoute);

app.get('/add/:size')

app.listen(PORT, function() {
	console.log(`App started on port ${PORT}`)
});