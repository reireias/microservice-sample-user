const pkg = require('../package.json')

module.exports = {
  openapi: '3.0.0',
  info: {
    title: pkg.title,
    version: pkg.version,
    description: pkg.description
  },
  servers: [
    {
      url: '/v1'
    }
  ]
}
