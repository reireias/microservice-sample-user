const express = require('express')
const users = require('./v1/users.js')
const follows = require('./v1/follows.js')

const router = express.Router()

// swagger
if (process.env.NODE_ENV === 'development') {
  const swaggerJSDoc = require('swagger-jsdoc')
  const options = {
    swaggerDefinition: require('../swagger/swaggerDef.js'),
    apis: [
      './controllers/v1/users.js',
      './controllers/v1/follows.js',
      './swagger/components.yml'
    ]
  }
  const swaggerSpec = swaggerJSDoc(options)
  // CROS
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, DELETE, PUT, PATCH, OPTIONS'
    )
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })
  router.get('/v1/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

router.use('/v1/users', users)
router.use('/v1/users/:id/follows', follows)

module.exports = router
