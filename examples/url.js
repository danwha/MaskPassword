const express     = require('express')
const app         = express()

require('./utilities')

const MaskPassword = require('../dist/maskPassword')
  
app.listen(8080,async () => console.log(__line, 'started...'))
app.get('/', async (request, response, next) => response.sendStatus(200))

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