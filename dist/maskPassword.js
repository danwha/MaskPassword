/**
 * @module MaskPassword
 * 
 * @version 20210725
 * @copyright danwha
 * @language node.js
 */


const Sign = require('./sign')
const ruleStruct = require('./ruleStruct')


// class
class MaskPassword extends Sign {
  constructor(rule = undefined){
    super()
    this.struct = []
    this.structString = ''; 
    this.regExp = /^[가-힣A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/
    if(rule != undefined) this.#pushSequence(rule)

  }


  // #pushSequence
  #pushSequence = rule => {
    rule.forEach(item => {
      typeof item == 'string'
        ? this.#pushFix(item)
        : (this.struct.push(item), this.structString += item.type)
    })
  } 

  // #pushFix
  #pushFix (str) {
    let fix = JSON.parse(JSON.stringify(ruleStruct.typeFix));
    fix.format = str
    fix.length = fix.format.length
    this.struct.push(fix)

    let fixToken = ruleStruct.codeString
    this.structString += `${fixToken}[${fix.length}:${fix.format}]`
  } 

  static get fullYear()     {return ruleStruct.typeYear4}
  static get shortYear()    {return ruleStruct.typeYear2}
  static get namedMonth()   {return ruleStruct.typeMonth3}
  static get numericMonth() {return ruleStruct.typeMonth2}
  static get weekday()      {return ruleStruct.typeWeek}
  static get day()          {return ruleStruct.typeDate}
  static get hour()         {return ruleStruct.typeHour}
  static get minute()       {return ruleStruct.typeMinute}

  static get regularExpression(){return this.regExp}
  static set regularExpression(reg){this.regExp = reg}

  static get locale() {return this.localeTimes}
  static set locale(hours) {this.localeTimes = hours}

  static #setSymbols = symbols => {
    let _temp = []
    let $temp = ruleStruct.codeDates.concat(ruleStruct.codeString)
    for(let index = 0; index < symbols.length; index++){
      let char = symbols[index]
      if(_temp.includes(char) || $temp.includes(char)) {
        return {
              result : false, letter : char,  index  : index
            }
      }

      
      _temp.push(char)
      $temp[index] = char
    } // for

    for(let index = 0; index < symbols.length; index++){
      let char = symbols[index]
           if(index <  8) ruleStruct.codeDates[index] = char
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

    return {result : true, letter : '', index  : ''}
  } // #setSymbols

  static get symbols(){return ruleStruct.codeDates.concat(ruleStruct.codeString).join('')}
  static set symbols(symbols){this.#setSymbols(symbols)}

  static get enableLongNames(){return ruleStruct.longEnabled}
  static set enableLongNames(enable){ruleStruct.longEnabled = enable}

  static get monthNames() {return ruleStruct.longMonths}
  static set monthNames(names){
    if(names.length != 12 || names.some(m => m == '')) return
    ruleStruct.longMonths = names
  }

  static get weekNames(){return ruleStruct.longWeeks}
  static set weekNames(names){
    if(names.length != 7 || names.some(m => m == '')) return
    ruleStruct.longWeeks = names
  }

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
        if(item.format == '')   return {result:false, source: item.format, error:'no string'}
        else{
               if(item.format.length > 100)   return {result: false, source: item.format, error:'too long'}
          else if(! this.regExp.test(item.format)) return {result:false, source: item.format, error:'disallowed characters'}
          else                                fixStrings += item.format
        } // if
      } // if
    } // for

    if(fixStrings.length < 6)       return {result  : false,   source : '', error : 'The fixed string is short'}
    if(dateRule>0 && fixStrRule>0)  return {result  : true,  source : '', error : ''}
    
    return {result  : false, source  : '', error   : 'Requires datetime type and fixed string'}
  } // isValid()

  compare = (password, locale = undefined) => this.checkRule(this.struct, password, locale)
  compareRule = (rule, source, locale = undefined) => this.checkRule(rule, source, locale)

  encryption = (locale = undefined) => {
    let temp = {
      string      : [],
      struct      : [],
      stringJoins : '',
      rules       : [],
      rulesJoins  : '',
      secretKey   : '',
    }

    this.struct.forEach(item => {
      if(ruleStruct.codeDates.includes(item.type)){
        if(!ruleStruct.longEnabled){
          temp.struct.push(`n${item.length}`) // code : n?
        }else{
          
          let now = this.getNow(locale)
          let nameLength = 
          (item.type == ruleStruct.typeMonth3.type) ? now.month3.length :
              (item.type == ruleStruct.typeWeek.type) ? now.week.length : item.length
          temp.struct.push(`n${nameLength}`) // code : n?
        }
        temp.rules.push(item.type);

      }else{
        let str = item.format
        let len = str.length
        temp.struct.push(`s${len}`) // code : s?
        temp.string.push(str)
        temp.rules.push(`${item.type}[${len}:${str}]`)
      }
    }) // forEach

    temp.stringJoins = temp.string.join('')
    var stringBase64 = Buffer.from(temp.stringJoins).toString('base64')
    if(stringBase64.length < 32 ) stringBase64 += '\x00'.repeat(32)
    temp.secretKey = stringBase64.substr(0,32) // string32Bytes
    temp.rulesJoins = temp.rules.join('')

    let en = this.encrypt(temp.rulesJoins, temp.secretKey)
    return {
      struct  : Buffer.from(temp.struct.join(','), 'utf-8').toString('hex'),
      iv      : en.iv,
      content : en.content
    }
  } // encryption

  decryption = (encrypt, password, locale = undefined) => {
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
    let secretKey = stringBase64.substr(0,32)

    // decrypt
    let decryptedJson = this.str2json(this.decrypt(encrypt, secretKey))
    if(decryptedJson.length == 0) return false;
    return this.compareRule(decryptedJson, password, locale)
  } // decryption

  checkRule (rule, source, locale = undefined) {
    const now = this.getNow(locale)
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
      }else if(item.type == ruleStruct.typeFix.type){
        $goal = item.format
      } // if

      $rule.push($goal)
    }) // forEach

    let goals = []
    $rule.forEach(item => goals.push(item))

    return source == goals.join('')
  }
} 




module.exports = MaskPassword     //export default MaskPassword