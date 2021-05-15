/**
 * @module MaskPassword
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210515
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
  codeString : 's',

  shortMonths : ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  shortWeeks  : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],

  // added 20210329
  longEnabled : false, // if true, shortMonths, shortWeeks are disabled.
  longMonths  : ['January','February','March','April','May','June','July','August','September','October','November','December'],
  longWeeks   : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
}

//var regExp = /^[A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/
var regExp = /^[가-힣A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/
var localeTimes = 0

module.exports = class MaskPassword {
  constructor(rule = undefined){
    this.struct = []
    this.structString = ''

    if(rule != undefined) this.#pushSequence(rule)
  }

  #pushSequence = rule => {
    rule.forEach(item =>{
      typeof item == 'string'
        ? this.#pushFix(item)
        : (this.struct.push(item), this.structString += item.type)
    })
  } // #pushSequence
  #pushFix = str => {
    let fix = JSON.parse(JSON.stringify(ruleStruct.typeFix));
    fix.format = str
    fix.length = fix.format.length
    this.struct.push(fix)

    let fixToken = ruleStruct.codeString
    this.structString += `${fixToken}[${fix.length}:${fix.format}]`
  } // #pushFix

  /**
   * @description change RegExp(Regular Expression)
   * @param       {RegExp}  reg
   * @default     /^[가-힣A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/
   */
  static setRegularExpression(reg){regExp = reg}

  /**
   * @description get RegExp(Regular Expression)
   * @return      {RegExp}
   * @default     /^[가-힣A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/
   */
  static getRegularExpression(){return regExp}

  /**
   * @description locale
   * @param       {uint}  hours
   * @default     0
   */
  static setLocale(hours){localeTimes = hours}

  /**
   * @description locale
   * @return      {uint}
   * @default     0
   */
  static getLocale(){return localeTimes}

  /**
   * @description mnemonic symbols
   * @param       {string}  symbols
   * @default     YyMmwdhIs
   * @return      {JSON}
   */
  static setSymbols(symbols){
    let _temp = []
    let $temp = ruleStruct.codeDates.concat(ruleStruct.codeString)
    for(let index = 0; index < symbols.length; index++){
      let char = symbols[index]
      if(_temp.includes(char)) return {
        result : false,
        letter : char,
        index  : index
      }
      if($temp.includes(char)) return {
        result : false,
        letter : char,
        index  : index
      }
      _temp.push(char)
      $temp[index] = char
    } // for

    for(let index = 0; index < symbols.length; index++){
      let char = symbols[index]
      if(index < 8)       ruleStruct.codeDates[index] = char
      else if(index == 8) ruleStruct.codeString = char
      switch(index){
        case 0: ruleStruct.typeYear4.type = char;   break;
        case 1: ruleStruct.typeYear2.type = char;   break;
        case 2: ruleStruct.typeMonth3.type = char;  break;
        case 3: ruleStruct.typeMonth2.type = char;  break;
        case 4: ruleStruct.typeWeek.type = char;    break;
        case 5: ruleStruct.typeDate.type = char;    break;
        case 6: ruleStruct.typeHour.type = char;    break;
        case 7: ruleStruct.typeMinute.type = char;  break;
        case 8: ruleStruct.typeFix.type = char;     break;
      }
    } // for

    return {
      result : true,
      letter : '',
      index  : ''
    }
  } // setSymbols

  /**
   * @description mnemonic symbols
   * @return      {string}
   * @default     YyMmwdhIs
   */
  static getSymbols(){
    return ruleStruct.codeDates.concat(ruleStruct.codeString).join('')
  }

  // [ added 20210324
  /**
   * @description name mode change
   * @param {bool} enable 
   * @returns {bool} enabled/disabled(default)
   */
  static enableLongNames(enable = undefined){
    if(enable == undefined) return ruleStruct.longEnabled
    ruleStruct.longEnabled = enable
  }
  /**
   * @description set month name
   * @param {string[]} names 12 month names
   * @returns {bool} success/failure
   * @returns {string[]} 12 month names
   */
  static monthNames(names = undefined){
    if(names == undefined) return ruleStruct.longMonths
    if(names.length != 12) return false
    if(names.some(m => m == '')) return false
    ruleStruct.longMonths = names
    return true
  }
  /**
   * @description set weekday name
   * @param {string[]} names 7 day names
   * @returns {bool} success/failure
   * @returns {string[]} 7 day names
   */
  static weekNames(names = undefined){
    if(names == undefined) return ruleStruct.longWeeks
    if(names.length != 7) return false
    if(names.some(m => m == '')) return false
    ruleStruct.longWeeks = names
    return true
  }
  // ] added 20210324


  /** @constant {JSON} */
  static get fullYear()     {return ruleStruct.typeYear4}
  /** @constant {JSON} */
  static get shortYear()    {return ruleStruct.typeYear2}
  /** @constant {JSON} */
  static get namedMonth()   {return ruleStruct.typeMonth3}
  /** @constant {JSON} */
  static get numericMonth() {return ruleStruct.typeMonth2}
  /** @constant {JSON} */
  static get weekday()      {return ruleStruct.typeWeek}
  /** @constant {JSON} */
  static get day()          {return ruleStruct.typeDate}
  /** @constant {JSON} */
  static get hour()         {return ruleStruct.typeHour}
  /** @constant {JSON} */
  static get minute()       {return ruleStruct.typeMinute}

  /**
   * @description   rule syntax check
   * @returns       {JSON}
   */
  isValid = () => {
    var dateRule = 0
    var fixStrRule = 0
    var fixStrings = ''
    for(let index = 0 ; index < this.struct.length; index++){
      let item = this.struct[index]
      let type = item.type
      if(ruleStruct.codeDates.includes(type)) dateRule++
      if(ruleStruct.codeString.includes(type)){
        fixStrRule++
        if(item.format == ''){
          return {result:false, source: item.format, error:'no string'}
        }else{
          if(item.format.length > 100){
            return {result:false, source: item.format, error:'too long'}
          }else if(! regExp.test(item.format)){
            return {result:false, source: item.format, error:'disallowed characters'}
          }else{
            fixStrings += item.format
          }
        } // if
      } // if
    }

    if(fixStrings.length < 6) return {
      result  : false,
      source  : '',
      error   : 'The fixed string is short'
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
   * @param           {int}       locale(optional)
   * @returns         {JSON}
   */
  compare = (password, locale = undefined) => {
    return compareRule(this.struct, password, locale)
  } // compare

  /**
   * @description     compare
   * @param           {JSON[]}    rules   rule structure
   * @param           {string}    source  password statement
   * @param           {int}       locale(optional)
   * @returns         {JSON}
   */
  compareRule = (rule, source, locale = undefined) => {
    return compareRule(rule, source, locale)
  } // compareRule

  /**
   * @description encryption
   * @returns     {JSON[]}
   */
  encryption = (locale = undefined) => { // @added 20210329
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
        if(! ruleStruct.longEnabled){
          temp.struct.push(`n${item.length}`) // code : n?
        }else{
          let now = getNow(locale)
          let nameLength = 
          (item.type == ruleStruct.typeMonth3.type) ? now.month3.length :
          (item.type == ruleStruct.typeWeek.type) ? now.week.length : item.length
          temp.struct.push(`n${nameLength}`) // code : n?
        }
        temp.rules.push(item.type)
      }else{
        let str = item.format
        let len = str.length
        temp.struct.push(`s${len}`) // code : s?
        temp.string.push(str)
        temp.rules.push(`${item.type}[${len}:${str}]`)
      }
    }) // forEach

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
  } // encryption

  /**
   * @description decryption
   * @param       {JSON[]}  encrypt
   * @param       {string}  password
   * @param       {int}     locale(optional)
   * @returns     {string}
   */
  decryption = (encrypt, password, locale = undefined) => {
    let structString = Buffer.from(encrypt.struct, 'hex').toString('utf-8')
    let struct = structString.split(',')
    //console.log(__line,struct)

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
    let decrypted = decrypt(encrypt, secreatKey)
    let decryptedJson = str2json(decrypted)
    if(decryptedJson.length == 0) return false;
    let compare = this.compareRule(decryptedJson, password, locale)
    return compare
  } // decryption
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
      case ruleStruct.typeYear4.type:   json.push(ruleStruct.typeYear4);  index++;  break
      case ruleStruct.typeYear2.type:   json.push(ruleStruct.typeYear2);  index++;  break
      case ruleStruct.typeMonth3.type:  json.push(ruleStruct.typeMonth3); index++;  break
      case ruleStruct.typeMonth2.type:  json.push(ruleStruct.typeMonth2); index++;  break
      case ruleStruct.typeWeek.type:    json.push(ruleStruct.typeWeek);   index++;  break
      case ruleStruct.typeDate.type:    json.push(ruleStruct.typeDate);   index++;  break
      case ruleStruct.typeHour.type:    json.push(ruleStruct.typeHour);   index++;  break
      case ruleStruct.typeMinute.type:  json.push(ruleStruct.typeMinute); index++;  break
      case ruleStruct.typeFix.type:
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
const encrypt = (text, secretKey = SecretKey) => {
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
const decrypt = (hash, secretKey = SecretKey) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])
  return decrpyted.toString()
}

const getNow = (locale = undefined) => {
  const dayUTC = new Date();
  const dayUTCUnixtime = dayUTC.getTime() / 1000
  const dayKrUnixtime = dayUTCUnixtime + (locale == undefined ? localeTimes * 3600 : locale * 3600)
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

  return {
    day     : day,
    year4   : day.getUTCFullYear().toString(),
    year2   : day.getUTCFullYear().toString().substr(2,2),
    month3  : ruleStruct.longEnabled
      ? ruleStruct.longMonths[day.getUTCMonth()]
      : ruleStruct.shortMonths[day.getUTCMonth()].toUpperCase(),
    month2  : makeZeroString((day.getUTCMonth() + 1)),
    week    : ruleStruct.longEnabled
      ? ruleStruct.longWeeks[day.getUTCDay()]
      : ruleStruct.shortWeeks[day.getUTCDay()].toUpperCase(),
    date    : makeZeroString(day.getUTCDate()),
    hour    : makeZeroString(day.getUTCHours()),
    minute  : makeZeroString(day.getUTCMinutes()),
  }
}
/**
 * @description compare
 * @param       {JSON[]}    rules   rule structure
 * @param       {string}    source  password statement
 * @param       {int}       locale(optional)
 * @returns     {JSON}
 */
const compareRule = (rule, source, locale = undefined) => {
  const now = getNow(locale)
  var index = 0
  let $rule = []
  rule.forEach(item => {
    var $goal
    if(ruleStruct.codeDates.includes(item.type)){
      switch(item.type){ /* ['Y','y','M','m', 'w', 'd', 'h', 'I'] */
        case ruleStruct.typeYear4.type: $goal = now.year4;   break
        case ruleStruct.typeYear2.type: $goal = now.year2;   break
        case ruleStruct.typeMonth3.type:$goal = now.month3;  break
        case ruleStruct.typeMonth2.type:$goal = now.month2;  break
        case ruleStruct.typeWeek.type:  $goal = now.week;    break
        case ruleStruct.typeDate.type:  $goal = now.date;    break
        case ruleStruct.typeHour.type:  $goal = now.hour;    break
        case ruleStruct.typeMinute.type:$goal = now.minute;  break
      }
      index += item.length
    }else if(item.type == ruleStruct.typeFix.type){
      let length = item.length
      $goal = item.format
      index += length
    } // if

    $rule.push($goal)
  }) // forEach

  //console.log(__line, $rule)
  let goals = []
  $rule.forEach(item => goals.push(item))
  let goalsJoined = goals.join('')
  let match = source == goalsJoined
  //console.log(__line, source, goalsJoined)
  return match
} // compareRule
