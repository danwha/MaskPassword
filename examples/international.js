require('./utilities')

const MaskPassword = require('../dist/maskPassword')

const samples =[
  {
    id : 'person0',
    locale  : 9,
    languageRegExp : /^[가-힣A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/,
    rule : ['해돋이', MaskPassword.hour, '해넘이'],
  },
  {
    id : 'person1',
    locale  : 0,
    languageRegExp : /^[A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/,
    rule : ['Sunrise', MaskPassword.hour, 'Sunset']
  },
  {
    id : 'person2',
    locale  : 17,
    languageRegExp : /^[ぁ-ゔ一-龥0-9-!:^_'?,.=\s+]{1,200}$/,
    rule : ['日の出', MaskPassword.hour, '日没']
  },
]

samples.forEach(person => {
  MaskPassword.regularExpression = person.languageRegExp
  person.encrypt = new MaskPassword(person.rule).encryption()
})

const verifier = new MaskPassword()
samples.forEach($person => {
  samples.forEach(_person => {
    for(h = 0; h < 24; h++){
      const password = `${_person.rule[0]}${right(h,2)}${_person.rule[2]}`
      const decrypt = verifier.decryption($person.encrypt, password)
      if(decrypt){
        console.log(__line, $person.id,password)
      }
    }
  })
})
