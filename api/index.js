require('./db/jsondb')
const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Require API routes
const users = require('./routes/users')
const products = require('./routes/products')
const producers = require('./routes/producers')
const oders = require('./routes/oders')
const customers = require('./routes/customers')
const assets = require('./routes/assets')
const settings = require('./routes/settings')
// Import API Routes
app.use('/user',users)
app.use('/product',products)
app.use('/producer',producers)
app.use('/oder',oders)
app.use('/customer',customers)
app.use('/asset',assets)
app.use('/setting',settings)

app.use('/ver', function (req, res, next) {
  return res.status(200).send({mess: "Wellcome API 1.0 .."})
})

// Export express app
module.exports = app
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}