require('./utilities')

const MaskPassword = require('../dist/maskPassword')

const rule = [
  'Summer',
  MaskPassword.namedMonth,
  'Winter',
  MaskPassword.weekday
]

months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
weeks  = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

MaskPassword.locale = 9

const manager = new MaskPassword(rule)
const encrypt = manager.encryption()

for(let m = 0; m < 12; m++){
  for(let w = 0; w < 7; w++){
    const password = `Summer${months[m]}Winter${weeks[w]}`
    const decrypt = manager.decryption(encrypt, password)
    if(decrypt) console.log(__line, password)
  }  
}

