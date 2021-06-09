# Masked Password

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
  1. 'Sunrise in the east.'
  2. short numeric year
  3. numeric month
  4. 'hot summer has come.'

  If now is June 2021, the correct password is
    'Sunrise in the east.2106hot summer has come.'.

  If now is October 2022, the correct password is 'Sunrise in the east.2210hot summer has come.'.

## install & require
  1. npm i maskpassword
  2. const MaskPassword = require('maskpassword')

## npmjs
  https://www.npmjs.com/package/maskpassword

## github
  https://github.com/danwha/MaskPassword

## usage
  0. preparations
  * 0-1. require
    ```javascript
    const MaskPassword = require('maskpassword')
      or
    const MaskPassword = require('./maskPassword')
    ```
  * 0-2. regular expression(20210609, v1.2.0)
    ```javascript
    MaskPassword.regularExpression(<reg>)
    MaskPassword.regularExpression()
    ```
  * 0-3. locale(20210609, v1.2.0)
    ```javascript
    MaskPassword.locale(<hours>)
    MaskPassword.locale()
    ```
  * 0-4. long names
    ```javascript
    MaskPassword.enableLongNames(<bool>)
    MaskPassword.enableLongNames()

    MaskPassword.monthNames(<strings>)
    MaskPassword.monthNames()

    MaskPassword.weekNames(<strings>)
    MaskPassword.weekNames()
    ```

  1. creation
  * 1-1. receive        : <user's rule>
  * 1-2. declare & making rule
    ```javascript
    let ValidMask = new MaskPassword([rule])
    ```
  * 1-3. checking
    ```javascript
    ValidMask.isValid()
    ```
  * 1-4. encrypt
    ```javascript
    let ruleEncrypt = ValidMask.encryption()
    ```
  * 1-5. save(aka db)
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

## See [CHANGED.md](https://github.com/danwha/MaskPassword/blob/main/CHANGED.md) for more.

## If this has helped
  ### I think I can do better if I eat chicken.
  > ETH Wallet : 0x03AA0D76BE8f547244c5A7410674f400142305b0
