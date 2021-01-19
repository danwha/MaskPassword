/**
 * test code
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210120
 * @copyright danwha
 * @language node.js
 */

require('./utilities')

 /**
  * @requires maskPassword.js
  */
//const MaskPassword = require('./maskPassword')  // with local package
const MaskPassword = require('maskpassword')      // installed with npm

const validRegExp   = /^[가-힣A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/
const invalidRegExp = `/^[가-A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/`
const setRegExp = reg => {
  var isValid = true;
  try {new RegExp(reg)} catch(e) {isValid = false}
  if(isValid) MaskPassword.setRegularExpression(reg)
  return isValid
}
console.log(__line, setRegExp(validRegExp))

MaskPassword.setLocale(9) // korean

let ValidMask = new MaskPassword()
ValidMask.pushMonth2()
ValidMask.pushFix('Talking to the moon.')
ValidMask.pushDate()
ValidMask.pushFix('Walking on the roof.')
ValidMask.pushHour()
console.log(__line, 'ValidStatement struct', ValidMask.struct)
console.log(__line, 'ValidStatement string', ValidMask.structString)

let InvalidMask = new MaskPassword()
InvalidMask.pushMonth2()
InvalidMask.pushDate()
InvalidMask.pushHour()
console.log(__line, 'InvalidStatement struct', InvalidMask.struct)
console.log(__line, 'InvalidStatement string', InvalidMask.structString)

console.log(__line, MaskPassword.getRegularExpression())

console.log('Valid', ValidMask.isValid())
console.log('Invalid', InvalidMask.isValid())

let ruleEncrypt = ValidMask.encryption()
console.log(__line, 'Rule encrypt', ruleEncrypt)

let storage = ruleEncrypt

let ruleStr0 = ValidMask.decryption(storage, '')
let ruleStr1 = ValidMask.decryption(storage, '01Legna07자하15')
console.log(__line, ruleStr0)
console.log(__line, ruleStr1)

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
console.log(__line, ruleStr2)

console.log(MaskPassword.getSymbols())
console.log(MaskPassword.setSymbols('ASDFGHJKLM'))
//console.log(MaskPassword.setSymbols('ASDFs'))
console.log(MaskPassword.getSymbols())

let ValidMask2 = new MaskPassword()
ValidMask2.pushSequence([
  'Talking to the moon.',
  MaskPassword.day,
  'Walking on the roof.',
  MaskPassword.hour
])
console.log(__line, 'ValidStatement struct', ValidMask2.struct)
console.log(__line, 'ValidStatement string', ValidMask2.structString)
