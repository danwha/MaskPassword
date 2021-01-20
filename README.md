
# Masked Password

## 2021012018(v1.0.1)
  bug fix

## 20210120 
  ### setSymbols(), getSymbols()
  ```javascript
  console.log(MaskPassword.getSymbols())
  console.log(MaskPassword.setSymbols('ASDFGHJKLM'))
  ```
  ### pushSequence()
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

## 20210119 setLocale(), getLocale()
  ```javascript
  MaskPassword.setLocale(9)
  console.log(MaskPassword.getLocale())
  ```

## 20210118 setRegularExpression(), getRegularExpression()
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

## 20210116 changed to class
## 20210115 added 
  1. There were complaints that it was not encrypted. Encrypted.
  2. There was a complaint that the server administrator could know the password rules. I've tried.

## why - Many services require the following:
  1. Don't use passwords that are easy to remember.
  2. The length of the password is increasing.
  3. Mix letters, numbers and symbols.
  4. Require periodic changes.
  5. The demanding rules get more complicated.

## as results
  1. It's hard to remember.
  2. Despite its complexity, password leaks are common.
  3. Complex rules don't prevent leaks, but they are good for users to forget.

## suggestion
  1. It has as set format that is easy to remember.
  2. It has to change itself.

## then
  1. Contains custom strings.
  2. It includes the year, month, day, week, and time set by the user.
  3. User can change the order.
  4. If necessary, additional encryption can be added.

## example
  1. fixed string : danwha
  2. Month name associated with the month
  3. fixed string : -
  4. Current hour

  If today is January 8, 2021 at 22:00, the correct password is danwhaJAN-22.

  If today is August 18, 2021 09:00, the correct password is danwhaAUG-09.

## install & require
  1. npm i maskpassword
  2. const MaskPassword = require('maskpassword')

## npmjs
  https://www.npmjs.com/package/maskpassword

## github
  https://github.com/danwha/MaskPassword

## usage
  1. creation
  * 1-1. require
    ```javascript
    const MaskPassword = require('maskpassword')
      or
    const MaskPassword = require('./maskPassword')
    ```
  * 1-2. regular expression
    ```javascript
    MaskPassword.setRegularExpression(<reg>)
    MaskPassword.getRegularExpression()
    ```
  * 1-3. locale
    ```javascript
    MaskPassword.setLocale(<hours>)
    MaskPassword.getLocale()
    ```

  * 1-4. receive        : <user's rule>
  * 1-5. declare
    ```javascript
    let ValidMask = new MaskPassword()
    ```
  * 1-6. making rule
    ```javascript
    ValidMask.push<any>([optional])
    ```
  * 1-7. checking
    ```javascript
    ValidMask.isValid()
    ```
  * 1-8. encrypt
    ```javascript
    let ruleEncrypt = ValidMask.encryption()
    ```
  * 1-9. save(aka db)
    ```javascript
    let storage = ruleEncrypt
    ```
  2. verification
  * 2-1. receive        : <user's password>
  * 2-2. load(aka db)   : 
  * 2-3. decrypt
    ```javascript
    let ruleStr2 = ValidMask.decryption(storage, password)
    ```

## If this has helped
  ### I think I can do better if I eat chicken.
  > ETH Wallet : 0x03AA0D76BE8f547244c5A7410674f400142305b0
