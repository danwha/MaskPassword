/**
 * @module MaskPassword
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210116
 * @since 2020
 * @copyright danwha
 * @language node.js
 */

 /**
  * @requires crypto
  */
const crypto = require('crypto');

/** 
  * @constant
  * @type {JSON}
  * @default
  */
const ruleStruct = {
  typeYear4 : { "type":"Y", "length":4, "format":"n"},
  typeYear2 : { "type":"y", "length":2, "format":"n"},
  typeMonth3: { "type":"M", "length":3, "format":"s"},
  typeMonth2: { "type":"m", "length":2, "format":"n"},
  typeWeek  : { "type":"w", "length":3, "format":"s"},
  typeDate  : { "type":"d", "length":2, "format":"n"},
  typeHour  : { "type":"h", "length":2, "format":"n"},
  typeMinute: { "type":"I", "length":2, "format":"n"},
  typeFix   : { "type":"s", "length":0, "format":""},

  codeDates : ['Y','y','M','m', 'w', 'd', 'h', 'I'],
  codeStrings : ['s'],

  shortMonths : ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  shortWeeks  : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
}
//const regExp = /^[A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/
const regExp = /^[가-힣A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/

module.exports = class MaskPassword {
  constructor(){
    this.struct = []
    this.structString = ''
  }

  /**
   * @description     push items
   */
  pushYear4(){
    this.struct.push(ruleStruct.typeYear4)
    this.structString += ruleStruct.typeYear4.type
  }
  pushYear2(){
    this.struct.push(ruleStruct.typeYear2)
    this.structString += ruleStruct.typeYear2.type
  }
  pushMonth3(){
    this.struct.push(ruleStruct.typeMonth3)
    this.structString += ruleStruct.typeMonth3.type
  }
  pushMonth2(){
    this.struct.push(ruleStruct.typeMonth2)
    this.structString += ruleStruct.typeMonth2.type
  }
  pushWeek(){
    this.struct.push(ruleStruct.typeWeek)
    this.structString += ruleStruct.typeWeek.type
  }
  pushDate(){
    this.struct.push(ruleStruct.typeDate)
    this.structString += ruleStruct.typeDate.type
  }
  pushHour(){
    this.struct.push(ruleStruct.typeHour)
    this.structString += ruleStruct.typeHour.type
  }
  pushMinute(){
    this.struct.push(ruleStruct.typeMinute)
    this.structString += ruleStruct.typeMinute.type
  }
  pushFix(str){
    let fix = JSON.parse(JSON.stringify(ruleStruct.typeFix));
    fix.format = str
    fix.length = fix.format.length
    this.struct.push(fix)

    this.structString += `s[${fix.length}:${fix.format}]`
  }

  /**
   * @description   rule syntax check
   * @returns       {JSON}
   */
  isValid(){
    var dateRule = 0
    var fixStrRule = 0
    for(let index = 0 ; index < this.struct.length; index++){
      let item = this.struct[index]
      let type = item.type
      if(ruleStruct.codeDates.includes(type)) dateRule++
      if(ruleStruct.codeStrings.includes(type)){
        fixStrRule++
        if(item.format == ''){
          return {result:false, source: item.format, error:'no string'}
        }else{
          if(item.format.length > 100){
            return {result:false, source: item.format, error:'too long'}
          }else if(! regExp.test(item.format)){
            return {result:false, source: item.format, error:'disallowed characters'}
          }
        } // if
      } // if
    }

    if(dateRule>0 && fixStrRule>0) return {
      result  : true,
      source  : '',
      error   : ''
    }

    return {
      result  : false,
      source  : '',
      error   : 'Requires datetime type and fixed string'
    }
  } // isValid()

  /**
   * @description     compare
   * @param           {string}    source  password statement
   * @returns         {JSON}
   */
  compare(password){
    return compareRule(this.struct, password)
  } // compare

  /**
   * @description     compare
   * @param           {JSON[]}    rules   rule structure
   * @param           {string}    source  password statement
   * @returns         {JSON}
   */
  compareRule(rule, source){
    return compareRule(rule, source)
  } // compareRule


  /**
   * @description encryption
   * @returns     {JSON[]}
   */
  encryption(){
    let result = {}

    let temp = {
      string      : [],
      struct      : [],
      stringJoins : '',
      rules       : [],
      rulesJoins  : '',
      secreatKey  : '',
    }
    this.struct.forEach(item => {
      if(ruleStruct.codeDates.includes(item.type)){
        temp.struct.push(`n${item.length}`)
        temp.rules.push(item.type)
      }else{
        let str = item.format
        let len = str.length
        temp.struct.push(`s${len}`)
        temp.string.push(str)
        temp.rules.push(`s[${len}:${str}]`)
      }
    })

console.log(__line, temp.struct.join(','))

    let buffer = Buffer.from(temp.struct.join(','), 'utf-8')
    result.struct = buffer.toString('hex')
    temp.stringJoins = temp.string.join('')
    var stringBase64 = Buffer.from(temp.stringJoins).toString('base64')
    if(stringBase64.length < 32 ) stringBase64 += '\x00'.repeat(32)
    let string32Bytes = stringBase64.substr(0,32)

    temp.secreatKey = string32Bytes
    temp.rulesJoins = temp.rules.join('')
    let en = encrypt(temp.rulesJoins, temp.secreatKey)
    result.iv = en.iv
    result.content = en.content

    return result
  } // 

  /**
   * @description decryption
   * @param       {JSON[]}  encrypt
   * @param       {string}  password
   * @returns     {string}
   */
  decryption(encrypt, password){
    let structString = Buffer.from(encrypt.struct, 'hex').toString('utf-8')
    let struct = structString.split(',')

    // get fixed string
    var index = 0
    let fixed = []
    struct.forEach(item => {
      let key = item.substr(0,1)
      let len = item.substr(1) * 1
      let str = password.substr(index,len)
      if(key == 's') fixed.push(str)
      index += len
    })
    let fixedString = fixed.join('')

    // make secreat key
    var stringBase64 = Buffer.from(fixedString).toString('base64')
    if(stringBase64.length < 32 ) stringBase64 += '\x00'.repeat(32)
    let secreatKey = stringBase64.substr(0,32)
    // decrypt
    let decryptedJson = str2json(decrypt(encrypt, secreatKey))
    if(decryptedJson.length > 0 == 0) return false;
    let compared = this.compareRule(decryptedJson, password)
    return compared
  }

} // class

/**
 * @description String to JSON
 * @param       {String} str
 * @returns     {JSON[]}
 */
str2json = str => {
  var index = 0
  let len = str.length
  let json = []
  while(index < len){
    let code = str[index]
    switch(code){
      case 'Y': json.push(ruleStruct.typeYear4);  index++;  break
      case 'y': json.push(ruleStruct.typeYear2);  index++;  break
      case 'M': json.push(ruleStruct.typeMonth3); index++;  break
      case 'm': json.push(ruleStruct.typeMonth2); index++;  break
      case 'w': json.push(ruleStruct.typeWeek);   index++;  break
      case 'd': json.push(ruleStruct.typeDate);   index++;  break
      case 'h': json.push(ruleStruct.typeHour);   index++;  break
      case 'I': json.push(ruleStruct.typeMinute); index++;  break
      case 's':
        let z = str.substr(index, len)
        let n = z.indexOf(':')
        let l = z.substr(2,n-2)
        let s = z.substr(n+1, l)
        index += (n + 2 + l*1)
        let fix = JSON.parse(JSON.stringify(ruleStruct.typeFix));
        fix.format = s
        fix.length = l*1
        json.push(fix)
        break
      default: // fail
        return []
    } // switch
  } // while

  return json
} // str2json



/**
 * @constant
 * @thanks https://attacomsian.com/blog/nodejs-encrypt-decrypt-data
 */

 // aes-128-ctr, aes-192-ctr, aes-256-ctr
 const algorithm = 'aes-256-ctr';
 const SecretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'; // 32 bytes : 256 bits
 const iv = crypto.randomBytes(16);
 
/**
 * @description encrypt
 * @param {string} text
 * @returns {JSON}
 */
encrypt = (text, secretKey = SecretKey) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  }
}

/**
 * @description decrypt
 * @param {JSON} hash
 * @returns {string}
 */
decrypt = (hash, secretKey = SecretKey) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])
  return decrpyted.toString()
}

/**
 * @description     compare
 * @param           {JSON[]}    rules   rule structure
 * @param           {string}    source  password statement
 * @returns         {JSON}
 */
compareRule = (rule, source) => {
  const dayUTC = new Date();
  const dayUTCUnixtime = dayUTC.getTime() / 1000
  const dayKrUnixtime = dayUTCUnixtime + 9 * 60 * 60 // to locale korea
  const day = new Date(dayKrUnixtime * 1000)

  /**
   * @private
   * @description number with zeros on th left
   * @param       {numeric} value
   * @returns     {string}
   */
  const makeZeroString = value => {
    let s = '0' + value.toString();
    return s.substr(s.length - 2, 2);
  }

  const now = {
    day     : day,
    year4   : day.getUTCFullYear().toString(),
    year2   : day.getUTCFullYear().toString().substr(2,2),
    month3  : ruleStruct.shortMonths[day.getUTCMonth()].toUpperCase(),
    month2  : makeZeroString((day.getUTCMonth() + 1)),
    week    : ruleStruct.shortWeeks[day.getUTCDay()].toUpperCase(),
    date    : makeZeroString(day.getUTCDate()),
    hour    : makeZeroString(day.getUTCHours()),
    minute  : makeZeroString(day.getUTCMinutes()),
  }

  var index = 0
  let $rule = []
  rule.forEach(item => {
    let $item = {
      match   : false,
      source  : '',
      goal    : '',
    }

    if(ruleStruct.codeDates.includes(item.type)){
      $item.source = source.substr(index,item.length)

      switch(item.type){ /* ['Y','y','M','m', 'w', 'd', 'h', 'I'] */
        case 'Y': $item.goal = now.year4;   break
        case 'y': $item.goal = now.year2;   break
        case 'M': $item.goal = now.month3;  break
        case 'm': $item.goal = now.month2;  break
        case 'w': $item.goal = now.week;    break
        case 'd': $item.goal = now.date;    break
        case 'h': $item.goal = now.hour;    break
        case 'I': $item.goal = now.minute;  break
      }

      ['M','w'].includes(item.type)
        ? $item.match = ($item.goal == $item.source.toUpperCase())
        : $item.match = ($item.goal == $item.source*1)

      index += item.length
    }else if(item.type == 's'){
      let length = item.length
      $item.source = source.substr(index,length)
      $item.goal = item.format
      $item.match = (item.format == $item.source)
      index += length
    } // if

    $rule.push($item)
  }) // forEach

  let goals = []
  $rule.forEach(item => goals.push(item.goal))
  let goalsJoined = goals.join('')
  let match = source == goalsJoined
  //console.log(__line, {verify:rule, match:match, goal:goalsJoined})
  return match
}
