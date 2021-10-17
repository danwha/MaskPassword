const express     = require('express')
const app         = express()

require('./utilities')

const MaskPassword = require('../dist/maskPassword')
  
app.listen(8080, (next) => {
  console.log('started...')
  next
})



app.get('/', async (req, res, next) => {
  res.sendStatus(200); 
  return next()
})

const manager = new MaskPassword([
  'The object is the void.',
  MaskPassword.day,
])


let encrypt = manager.encryption()

testapp = (request, response, next) => {
  let key = request.params.key
  let decrypt = manager.decryption(encrypt, key)
  response.send(decrypt ? 'Access ok' : 'access denied')
}


app.get('/test/:key',testapp)