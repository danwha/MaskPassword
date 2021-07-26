require('./utilities')

const MaskPassword = require('../dist/maskPassword')

const rule = [
  'Legna',
  MaskPassword.numericMonth,
  MaskPassword.day,
  MaskPassword.hour
]

const manager = new MaskPassword(rule)
const encrypt = manager.encryption()

for(let m = 1; m <= 12; m++){
  for(let d = 1; d <= 31; d++){
    for(let h = 0; h <= 23; h++){
      const password = `Legna${right(m,2)}${right(d,2)}${right(h,2)}`
      const decrypt = manager.decryption(encrypt, password)
      if(decrypt) console.log(__line, password)
    }  
  }
}