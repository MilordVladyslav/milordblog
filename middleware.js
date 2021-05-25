module.exports = {
  cors,
  notFound,
  handleError,
  handleValidationError
}

function cors(req, res, next) {
  const origin = req.headers.origin

  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, DELETE, OPTIONS, XMODIFY'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  )

  next()
}

function handleError(err, req, res, next) {
  console.error(err)
  if (res.headersSent) return next(err)
  res.status(500).json({ error: 'Internal Error' })
}

function notFound(req, res) {
  res.status(404).json({ error: 'Not Found' })
}

function handleValidationError(err, req, res, next) {
  if ((err.code || '').match(/^2[23]/)) err.name = 'ValidationError'
  if (err.name !== 'ValidationError') return next(err)
  const msg = err._message || err.message
  console.log(msg)
  res.status(400).json({ error: msg, errorDetails: err.errors })
}
