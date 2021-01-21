# 20210121(v1.0.3)
  ```javascript
  new MaskPassword()
  compare = (password)
  decryption(encrypt, password)

    changed to 

  new MaskPassword([rule])
  compare = (password[, locale])
  decryption(encrypt, password[, locale])
  ```

# 2021012020(v1.0.2)
# 2021012018(v1.0.1)
  bug fix

# 20210120 
  ## setSymbols(), getSymbols()
  ```javascript
  console.log(MaskPassword.getSymbols())
  console.log(MaskPassword.setSymbols('ASDFGHJKLM'))
  ```
  ## pushSequence()
  ```javascript
  let ValidMask1 = new MaskPassword()
  ValidMask1.pushFix('Talking to the moon.')
  ValidMask1.pushDate()
  ValidMask1.pushFix('Walking on the roof.')
  ValidMask1.pushHour()
  
    or

  let ValidMask2 = new MaskPassword()
  ValidMask2.pushSequence([
    'Talking to the moon.',
    MaskPassword.day,
    'Walking on the roof.',
    MaskPassword.hour
  ])

  console.log('ValidStatement struct', ValidMask2.struct)
  console.log('ValidStatement string', ValidMask2.structString)
  ```

# 20210119 setLocale(), getLocale()
  ```javascript
  MaskPassword.setLocale(9)
  console.log(MaskPassword.getLocale())
  ```

# 20210118 setRegularExpression(), getRegularExpression()
  ```javascript
  const validRegExp   = /^[가-힣A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/
  const invalidRegExp = `/^[가-A-Za-z0-9-!:^_'?,.=\s+]{1,200}$/`
  const setRegExp = reg => {
    var isValid = true;
    try {new RegExp(reg)} catch(e) {isValid = false}
    if(isValid) MaskPassword.setRegularExpression(reg)
    return isValid
  }
  console.log(MaskPassword.getRegularExpression())
  console.log(setRegExp(validRegExp))
  ```

# 20210116 changed to class
# 20210115 added 
  1. There were complaints that it was not encrypted. Encrypted.
  2. There was a complaint that the server administrator could know the password rules. I've tried.
