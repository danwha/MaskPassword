
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
  
    longEnabled : false, // if YES, shortMonths, shortWeeks are disabled.
    longMonths  : ['January','February','March','April','May','June','July','August','September','October','November','December'],
    longWeeks   : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
}


module.exports = ruleStruct