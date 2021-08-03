module.exports = function (reqBody = [], requiredFields = []) {
  const errors = []
  for (let key in requiredFields) {
    if (!reqBody[requiredFields[key]])
      errors.push(`${requiredFields[key]} is required`)
  }
  return errors
}
