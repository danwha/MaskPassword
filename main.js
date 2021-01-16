/**
 * test code
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210116
 * @since 2020
 * @copyright danwha
 * @language node.js
 */

require('./utilities')

 /**
  * @requires maskPassword.js
  */
 const MaskPassword = require('./maskPassword')

let ValidMask = new MaskPassword()
ValidMask.pushMonth2()
ValidMask.pushFix('Talking to the moon.')
ValidMask.pushDate()
ValidMask.pushFix('Walking on the roof.')
ValidMask.pushHour()
console.log('ValidStatement syntax', ValidMask)

let InvalidMask = new MaskPassword()
InvalidMask.pushMonth2()
InvalidMask.pushDate()
InvalidMask.pushHour()
console.log('InvalidStatement syntax', InvalidMask)


console.log('Valid', ValidMask.isValid())
console.log('Invalid', InvalidMask.isValid())


let ruleEncrypt = ValidMask.encryption()
console.log('Rule encrypt', ruleEncrypt)

let storage = ruleEncrypt

let ruleStr0 = ValidMask.decryption(storage, '')
let ruleStr1 = ValidMask.decryption(storage, '01Legna07자하15')

const dayUTC = new Date();
const dayUTCUnixtime = dayUTC.getTime() / 1000
const dayKrUnixtime = dayUTCUnixtime + 9 * 60 * 60 // to locale korea
const day = new Date(dayKrUnixtime * 1000)
const makeZeroString = value => {
  let s = '0' + value.toString();
  return s.substr(s.length - 2, 2);
}

let validPasswordStruct = [
  makeZeroString((day.getUTCMonth() + 1)),
  'Talking to the moon.',
  makeZeroString(day.getUTCDate()),
  'Walking on the roof.',
  makeZeroString(day.getUTCHours())
]
let validPassword = validPasswordStruct.join('')
let ruleStr2 = ValidMask.decryption(storage, validPassword)
console.log(__line, ruleStr0)
console.log(__line, ruleStr1)
console.log(__line, ruleStr2)
