/**
 * @module MaskPassword
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210107
 * @since 2020
 * @copyright danwha
 * @license GPLv2
 * @language node.js
 */

 /** 
  * @const
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
  typeFix   : { "type":"s", "length":0, "format":""}, // 금칙어는?

  codeDates : ['Y','y','M','m', 'w', 'd', 'h'],
  codeStrings : ['s'],

  shortMonths : ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  shortWeeks  : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
}

module.exports = {
  /**
   * @description     full year
   * @param           {JSON[]} rule
   * @mean            YYYY, aka 2021
   * @example         { type: 'Y', length: 4, format: 'n' }
   */
  pushYear4   : rule => {rule.push(ruleStruct.typeYear4)},
  
  /**
   * @description     short year
   * @param {JSON[]}  rule
   * @mean            YY, aka 21
   * @example         { type: 'y', length: 2, format: 'n' }
   */
  pushYear2   : rule => {rule.push(ruleStruct.typeYear2)},
  
  /**
   * @description     month name
   * @mean            Month name, aka JAN
   * @param {JSON[]}  rule 
   * @example         { type: 'M', length: 3, format: 's' }
   */
  pushMonth3  : rule => {rule.push(ruleStruct.typeMonth3)},
  
  /**
   * @description     month value
   * @mean            Month value, aka 01
   * @param {JSON[]}  rule 
   * @example         { type: 'm', length: 2, format: 'n' }
   */
  pushMonth2  : rule => {rule.push(ruleStruct.typeMonth2)},

  /**
   * @description     weekday
   * @mean            Weekday, aka THU
   * @param {JSON[]}  rule 
   * @example         { type: 'w', length: 3, format: 's' }
   */
  pushWeek    : rule => {rule.push(ruleStruct.typeWeek)},
  
  /**
   * @description     day value
   * @mean            day, aka 07
   * @param {JSON[]}  rule 
   * @example         { type: 'd', length: 2, format: 'n' }
   */
  pushDate    : rule => {rule.push(ruleStruct.typeDate)},

  /**
   * @description     hour
   * @mean            hour, aka 16
   * @param {JSON[]}  rule 
   * @example         { type: 'h', length: 2, format: 'n' }
   */
  pushHour    : rule => {rule.push(ruleStruct.typeHour)},

  /**
   * @description     string
   * @mean            fixed string, aka some statement
   * @param {JSON[]}  rule 
   * @example         { type: 's', length: 5, format: 'danwha' }
   */  
  pushFix     : (rule, str) =>{
    let fix = JSON.parse(JSON.stringify(ruleStruct.typeFix));
    fix.format = str
    fix.length = fix.format.length
    rule.push(fix)
  },

  /**
   * @description JSON to String
   * @param       {JSON[]} rule  rule structure
   * @example <caption>rule</caption>
   * [
   *  { type: 'm', length: 2, format: 'n' },
   *  { type: 's', length: 5, format: 'Legna' },
   *  { type: 'd', length: 2, format: 'n' },
   *  { type: 's', length: 2, format: '자하' },
   *  { type: 'h', length: 2, format: 'n' }
   * ]
   * @returns     {string}
   * @example <caption>returns</caption>
   *  ms[5:Legna]ds[2:자하]h
   */
  json2str : rule =>{
    var string = []
    rule.forEach(item => {
      if(ruleStruct.codeDates.includes(item.type)){
        string.push(item.type)
      }else{
        let str = item.format
        let len = str.length
        string.push(`s[${len}:${str}]`)
      }
    })
  
    return string.join('')
  }, // json2str

  /**
   * @description String to JSON
   * @param       {String} str
   * @returns     {JSON[]}
   */
  str2json : str => {
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
        default:
          console.log('fail', index, code)
          break;
      } // switch
    } // while

    return json
  }
}

/**
 * @description   rule syntax check
 * @param         {JSON[]}  rules
 * @returns       {boolean}
 */
module.exports.validRule = rule =>{
  //const regExp = /^[A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/
  const regExp = /^[가-힣A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/
  var dateRule = 0
  var fixStrRule = 0
  for(index = 0 ; index < rule.length; index++){
    let item = rule[index]
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

  if(dateRule>0 && fixStrRule>0) return {result:true}

  return {
    result:false,
    source: '',
    error:'Requires datetime type and fixed string'
  }
} // vaildRule

/**
 * @description     compare
 * @param           {JSON[]}    rules   rule structure
 * @param           {string}    source  password statement
 * @returns         {JSON}
 */
module.exports.compareRule = (rule, source) => {
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
  }

  var index = 0
  let $rule = []
  rule.forEach(item => {
    let $item = {
      match   : false,
      source  : '',
      goal    : '',
    }
    switch(item.type){
      case 'Y':
        $item.source = source.substr(index,4)
        $item.goal = now.year4*1
        index += 4
        $item.match = ($item.goal == $item.source*1)
        break
      case 'y':
        $item.source = source.substr(index,2)
        $item.goal = now.year2*1
        index += 2
        $item.match = ($item.goal == $item.source*1)
        break
      case 'M':
        $item.source = source.substr(index,3)
        $item.goal = now.month3
        index += 3
        $item.match = ($item.goal == $item.source.toUpperCase())
        break
      case 'm':
        $item.source = source.substr(index,2)
        $item.goal = now.month2
        index += 2
        $item.match = ($item.goal == $item.source)
        break
      case 'w':
        $item.source = source.substr(index,3)
        $item.goal = now.week
        index += 3
        $item.match = ($item.goal == $item.source.toUpperCase())
        break
      case 'd':
        $item.source = source.substr(index,2)
        $item.goal = now.date
        index += 2
        $item.match = ($item.goal == $item.source)
        break
      case 'h':
        $item.source = source.substr(index,2)
        $item.goal = now.hour
        index += 2
        $item.match = ($item.goal == $item.source)
        break
      case 's':
        let length = item.length
        $item.source = source.substr(index,length)
        $item.goal = item.format
        $item.match = (item.format == $item.source)
        index += length
        break
    } // switch
    $rule.push($item)
  })

  let goals = []
  $rule.forEach(item => goals.push(item.goal))
  let goalsJoined = goals.join('')
  let match = source == goalsJoined
  return {verify:rule, match:match, goal:goalsJoined}
} // compareRule
