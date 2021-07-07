const sqlite3 = require('sqlite3').verbose();

//const MaskPassword = require('maskpassword')      // installed with npm
const MaskPassword = require('../dist/maskPassword')

require('./utilities')

// 🔥 samples
const samples =[
  {id : 'person0', personal  : 9, rule : ['Sunrise in the east.', MaskPassword.shortYear, MaskPassword.numericMonth, 'hot summer has come.']},
  {id : 'person1', personal  : 0, rule : [MaskPassword.numericMonth, 'Talking to the moon.', MaskPassword.hour, 'Walking on the roof.']},
  {id : 'person2', personal  : 17,rule : [MaskPassword.numericMonth, MaskPassword.day, '冬の雨', '涙忘れた愛']}
]

const passwords = [
  'Sunrise in the east.2106hot summer has come.',
  'Sunset in the west.2106hot summer has come.',
  '06Talking to the moon.12Walking on the roof.',
  '06Talking to the moon.13Walking on the roof.',
  '0611冬の雨涙忘れた愛',
  '0612冬の雨涙忘れた愛',
]

samples.map(element => {
  const manager = new MaskPassword(element.rule)
  const encrypt = manager.encryption({secret:element.secret})
  element.encryptString = Object.values(encrypt).join('|')
})

const db = new sqlite3.Database(':memory:')

db.serialize(()=> {
  db.run('CREATE TABLE SecureTable (identy TEXT, password TEXT, personal INTEGER)')

  var stmt = db.prepare('INSERT INTO SecureTable VALUES (?,?,?)');
  for (let i = 0; i < samples.length; i++){
    stmt.run(
        samples[i].id,
        samples[i].encryptString,
        samples[i].personal
      )
  }
  stmt.finalize()

  const verifier = new MaskPassword()
  db.all(
    'SELECT rowid, identy, password, personal FROM SecureTable',
    (err, rows) => {
      rows.forEach(row => {
        const _encrypt = row.password.split('|')
        const encrypt = {
          struct  : _encrypt[0],
          iv      : _encrypt[1],
          content : _encrypt[2]
        }
  
        passwords.forEach(password => {
          const match = verifier.decryption(encrypt, password, row.personal)
          const report = match ? `\x1b[1m\x1b[91mYES\x1b[0m` : `\x1b[0mNO\x1b[0m`
          console.log(__line, `${row.identy} | ${row.personal} : ${password} -> ${report}`)
        }) // forEach  
      })
    }
  )
})

db.close()
