/**
 * test code
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210329
 * @copyright danwha
 */

const MaskPassword = require('maskpassword')      // installed with npm

require('./utilities')

console.log('🌹 edited 20210329 🌹')
console.log(__line, 'set locale to south korea')
MaskPassword.setLocale(9)

console.log(__line, 'monthNames', MaskPassword.monthNames())
console.log(__line, 'weekNames', MaskPassword.weekNames())

const shorter = {}
const longer = {}
const sampleRule = [
  'danwha',
  MaskPassword.namedMonth,
  'leonard',
]

// ----------------------------------------------
console.log('🐶 long name disabled ----------------------------------------------')

MaskPassword.enableLongNames(false)
console.log(__line, 'enableLongNames', MaskPassword.enableLongNames())
shorter.manager = new MaskPassword(sampleRule)
console.log(__line, 'isValid', shorter.manager.isValid())
console.log(__line, 'struct', shorter.manager.struct)
console.log(__line, 'string', shorter.manager.structString)
shorter.encrypt = shorter.manager.encryption()

console.log(__line, '❗️ Be careful with uppercase ❗️ ')
shorter.passwordCorrect = 'danwhaMARleonard'
shorter.decryptCorrect = shorter.manager.decryption(shorter.encrypt, shorter.passwordCorrect)
shorter.passwordWrong = 'danwhaMarleonard'
shorter.decryptWrong = shorter.manager.decryption(shorter.encrypt, shorter.passwordWrong)
console.log(__line, '💝 decrypt : ', shorter)

// ----------------------------------------------
console.log('🐶 long name enabled ----------------------------------------------')

MaskPassword.enableLongNames(true)
console.log(__line, 'enableLongNames', MaskPassword.enableLongNames())
longer.manager = new MaskPassword(sampleRule)
console.log(__line, 'isValid', longer.manager.isValid())
console.log(__line, 'struct', longer.manager.struct)
console.log(__line, 'string', longer.manager.structString)
longer.encrypt = longer.manager.encryption()

console.log(__line, '❗️ Be careful with uppercase and lowercase ❗️ ')
longer.passwordCorrect = 'danwhaMarchleonard'
longer.decryptCorrect = longer.manager.decryption(longer.encrypt, longer.passwordCorrect)
longer.passwordWrong = 'danwhaMarleonard'
longer.decryptWrong = longer.manager.decryption(longer.encrypt, longer.passwordWrong)
console.log(__line, '💝 decrypt : ', longer)
