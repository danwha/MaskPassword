require('./utilities')

const MaskPassword = require('../dist/maskPassword')

const rule = [
  'Summer',
  MaskPassword.namedMonth,
  'Winter',
  MaskPassword.weekday
]

months  = ['January','February','March','April','May','June','July','August','September','October','November','December']
weeks   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

MaskPassword.locale = 9
MaskPassword.enableLongNames = YES

const manager = new MaskPassword(rule)
const encrypt = manager.encryption()

for(let m = 1; m <= 12; m++){
  for(let w = 0; w < 7; w++){
    const password = `Summer${months[m]}Winter${weeks[w]}`
    const decrypt = manager.decryption(encrypt, password)
    if(decrypt) console.log(__line, password)
  }
}

