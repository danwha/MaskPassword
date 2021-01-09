/**
 * html example
 * 
 * @author danwha <danwha@hanmail.net>
 * @version 20210108
 * @since 2020
 * @copyright danwha
 * @language node.js
 */

/** @require express, ejs, body-parser */
const express     = require('express')
const app         = express()
const ejs         = require('ejs')
const bodyParser  = require('body-parser')

/** @requires maskPassword */
const Mask        = require('./maskPassword')

app.use(express.json()); // need how use
app.use(express.static(__dirname)); // current directory
app.use(express.urlencoded({ extended: true })); // with post data receive
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views',[__dirname,])
app.set('view engine', 'ejs'); // html template engine via jade
app.engine('html', ejs.renderFile);

app.listen(
  8080,
  async () => {
    console.log('starting...');
  }
)


app.get('/', async (request, response, next) => {
  let ValidStatement = []
  Mask.pushMonth2(ValidStatement)
  Mask.pushFix(ValidStatement, 'danwha')
  Mask.pushDate(ValidStatement)
  Mask.pushFix(ValidStatement, '자하')
  Mask.pushHour(ValidStatement)

  response.render('master.html',
    {
      rule : JSON.stringify(ValidStatement),
    }
  )
});

app.post('/registRule', async (request, response) => {
  const rule = request.body.rule

  var rules = []
  rule.forEach(rule => {
    switch(rule.type){
      case 'Y': Mask.pushYear4(rules);            break
      case 'y': Mask.pushYear2(rules);            break
      case 'M': Mask.pushMonth3(rules);           break
      case 'm': Mask.pushMonth2(rules);           break
      case 'w': Mask.pushWeek(rules);             break
      case 'd': Mask.pushDate(rules);             break
      case 'h': Mask.pushHour(rules);             break
      case 's': Mask.pushFix(rules, rule.value);  break
    }// switch
  })

  // verifying
  let valid = Mask.validRule(rules)
  if(!valid.result){
    response.json(valid)
    return
  }

  // make db string
  let ruleString = Mask.json2str(rules)
  let ruleJson = Mask.str2json(ruleString)
  response.json({
    result  : true,
    source  : rule,
    string  : ruleString,
    json    : JSON.stringify(ruleJson),
  })
})
