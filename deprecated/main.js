/**
 * test code
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210111
 * @since 2020
 * @copyright danwha
 * @language node.js
 */

require('./utilities')

 /**
  * @requires maskPassword.js
  */
 const Mask = require('./maskPassword')

/**
 * @type    {JSON[]}
 * @default []
 */
let ValidStatement = []

/**
 * @type    {JSON[]}
 * @default []
 */
let InvalidStatement = []

Mask.pushMonth2(ValidStatement)
Mask.pushFix(ValidStatement, 'Talking to the moon.')
Mask.pushDate(ValidStatement)
Mask.pushFix(ValidStatement, 'Walking on the roof.')
Mask.pushHour(ValidStatement)
console.log('ValidStatement syntax', ValidStatement)

Mask.pushMonth2(InvalidStatement)
Mask.pushDate(InvalidStatement)
Mask.pushHour(InvalidStatement)
console.log('InvalidStatement syntax', InvalidStatement)


console.log('Valid', Mask.validRule(ValidStatement))
console.log('Invalid', Mask.validRule(InvalidStatement))

let password0 = ''
let password1 = '01Legna07자하15'
let password2 = '01Talking to the moon.15Walking on the roof.00'

let ruleEncrypt = Mask.encryption(ValidStatement)
console.log('Rule encrypt', ruleEncrypt)

let storage = ruleEncrypt

let ruleStr0 = Mask.decryption(storage, password0)
let ruleJson0 = Mask.str2json(ruleStr0)
console.log(__line, ruleJson0.length == 0 ? '❌ access denied' : '❗️ rule success')

let ruleStr1 = Mask.decryption(storage, password1)
let ruleJson1 = Mask.str2json(ruleStr1)
console.log(__line, ruleJson1.length == 0 ? '❌ access denied' : '❗️ rule success')

let ruleStr2 = Mask.decryption(storage, password2)
let ruleJson2 = Mask.str2json(ruleStr2)
console.log(__line, ruleJson2.length == 0 ? '❌ access denied' : '❗️ rule success')

let compare0 = Mask.compareRule(ruleJson2, password0)
console.log(__line, password0, compare0.match ? '⭕️ access approved' : '❌ access denied')

let compare1 = Mask.compareRule(ruleJson2, password1)
console.log(__line, password1, compare1.match ? '⭕️ access approved' : '❌ access denied')

let compare2 = Mask.compareRule(ruleJson2, password2)
console.log(__line, password2, compare2.match ? '⭕️ access approved' : '❌ access denied')

