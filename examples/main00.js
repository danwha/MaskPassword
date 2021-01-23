/**
 * test code
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210123
 * @copyright danwha
 */


const express     = require('express')
const app         = express()

const MaskPassword = require('maskpassword')      // installed with npm

require('./utilities')

app.listen(8080,async () => console.log(__line, 'started...'))
app.get('/', async (request, response, next) => response.sendStatus(200))

const validRegExp   = /^[ぁ-ゔ一-龥0-9-!:^_'?,.=\s+]{1,200}$/
const setRegExp = reg => {
  var isValid = true;
  try {new RegExp(reg)} catch(e) {isValid = false}
  if(isValid) MaskPassword.setRegularExpression(reg)
  return isValid
}
console.log(__line, setRegExp(validRegExp))
MaskPassword.setLocale(9)

// 冬の雨??涙忘れた愛
const manager = new MaskPassword([
  '冬の雨',
  MaskPassword.day,
  '涙忘れた愛'
])
console.log(__line, 'isValid', manager.isValid())
console.log(__line, 'struct', manager.struct)
console.log(__line, 'string', manager.structString)
let encrypt = manager.encryption()
console.log(__line, 'encrypt', encrypt)

testapp = (request, response, next) => {
  console.log(__line, request.params)

  let key = request.params.key
  let decrypt = manager.decryption(encrypt, key)
  console.log(__line, 'decrypt', decrypt)

  response.send(decrypt)
}
app.get('/test/:key',testapp)