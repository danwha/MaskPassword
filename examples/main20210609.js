/**
 * test code
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210609
 * @copyright danwha
 */

 const sqlite3 = require('sqlite3').verbose();

//const MaskPassword = require('maskpassword')      // installed with npm
const MaskPassword = require('../dist/maskPassword')

require('./utilities')

console.log('🌹 edited 20210609 🌹')

console.log(__line, MaskPassword.locale())
MaskPassword.regularExpression(/^[A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/)
MaskPassword.symbols('ABCDEFGHIJ')
console.log(__line, MaskPassword.symbols())

MaskPassword.enableLongNames(false)


// 🔥 sample id
const identy = 'SunOfEast'

// 🔥 sample rule
const sampleRule = [
  'Sunrise in the east.',
  MaskPassword.shortYear,
  MaskPassword.numericMonth,
  'hot summer has come.',
]
console.log(__line, sampleRule)

const shorter = {}
shorter.manager = new MaskPassword(sampleRule)
shorter.encrypt = shorter.manager.encryption()
shorter.encryptString = Object.values(shorter.encrypt).join('|')
console.log(__line, {
  encrypt       : shorter.encrypt,
  encryptString : shorter.encryptString
})


const db = new sqlite3.Database(':memory:');

db.serialize(()=> {
  db.run('CREATE TABLE SecureTable (identy TEXT, password TEXT)')

  db.run(
    'INSERT INTO SecureTable VALUES (?,?)',
    [identy, shorter.encryptString]
  )

  db.get(
    'SELECT rowid, identy, password FROM SecureTable WHERE identy = ?',
    identy,
    (err, row) => {
      console.log(__line, row);

      const _encrypt = row.password.split('|')
      const encrypt = {
        struct  : _encrypt[0],
        iv      : _encrypt[1],
        content : _encrypt[2]
      }
      console.log(__line, encrypt)

      const verifier = new MaskPassword()
      verifier.passwordCorrect = 'Sunrise in the east.2106hot summer has come.'
      verifier.passwordWrong =   'Sunset in the west.2106hot summer has come.'
      verifier.decryptCorrect = verifier.decryption(encrypt, verifier.passwordCorrect)
      verifier.decryptWrong = verifier.decryption(encrypt, verifier.passwordWrong)
      console.log(__line, '💝 decrypt : ', [
        {
          password : verifier.passwordCorrect,
          correct  : verifier.decryptCorrect
        },
        {
          password : verifier.passwordWrong,
          correct  : verifier.decryptWrong
        }
      ])
    }
  )
})

db.close()
