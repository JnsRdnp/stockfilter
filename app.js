const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');
const InitialRoutes = require('./routes/InitialRoutes.js')
const StockFilterRoutes = require('./routes/StockFilterRoutes.js')

const app = express();

app.use(express.json());
app.use('/api/initialservice', InitialRoutes);
app.use('/api/stockfilter', StockFilterRoutes);

// Swagger UI setup
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Swagger running on http://localhost:3000/swagger');
});

module.exports = app; // for testing