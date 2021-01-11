/**
 * test code
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210111
 * @since 2020
 * @copyright danwha
 * @language node.js
 */

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
Mask.pushFix(ValidStatement, 'danwha')
Mask.pushDate(ValidStatement)
Mask.pushFix(ValidStatement, '자하')
Mask.pushHour(ValidStatement)
console.log('ValidStatement syntax', ValidStatement)

Mask.pushMonth2(InvalidStatement)
Mask.pushDate(InvalidStatement)
Mask.pushHour(InvalidStatement)
console.log('InvalidStatement syntax', InvalidStatement)


console.log('Valid', Mask.validRule(ValidStatement))
console.log('Invalid', Mask.validRule(InvalidStatement))

let password0 = ''
let compare0 = Mask.compareRule(ValidStatement, password0)
console.log('PASSWORD 0', password0, compare0.match)

let password1 = '01Legna07자하15'
let compare1 = Mask.compareRule(ValidStatement, password1)
console.log('PASSWORD 1', password1, compare1.match)

let password2 =  compare0.goal
let compare2 = Mask.compareRule(ValidStatement, password2)
console.log('PASSWORD 2', password2, compare2.match)

let str = Mask.json2str(ValidStatement)
console.log('Rule string', str)

let encrypt = Mask.encrypt(str)
console.log('Rule encrypt', encrypt)

let decrypt = Mask.decrypt(encrypt)
console.log('Rule decrypt', decrypt)

let json = Mask.str2json(decrypt)
console.log('Rule JSON', json)

