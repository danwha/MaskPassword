require('./utilities')

const MaskPassword = require('../dist/maskPassword')

const rule = [
  MaskPassword.hour,
  'Legna',
  MaskPassword.minute
]

const manager = new MaskPassword(rule)
const encrypt = manager.encryption()

for(let h = 0; h <= 23; h++){
  for(let m = 0; m <= 59; m++){
    const password = `${right(h,2)}Legna${right(m,2)}`
    const decrypt = manager.decryption(encrypt, password)
    if(decrypt) console.log(__line, password)
  }
}