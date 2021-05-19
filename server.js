const express = require('express')
const middleware = require('./middleware')
const port = process.env.PORT || 3000
const app = express()
app.use(middleware.cors)

// routes

app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)

app.listen(port, () =>
  // console.log(app)
  console.log(`Server listening on port ${port}`)
)
