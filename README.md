# Masked Password

## Build a flexible password based on datetime .

## example
  1. 'Sunrise in the east.'
  2. short numeric year
  3. numeric month
  4. 'hot summer has come.'

  If now is June 2021, the correct password is

    'Sunrise in the east.2106hot summer has come.'.

  If now is October 2022, the correct password is

    'Sunrise in the east.2210hot summer has come.'.

## install  
    npm i maskpassword

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
    import MaskPassword from 'maskpassword'
    ```

  * 0-2. class properties
    ```javascript
    MaskPassword.regularExpression
    MaskPassword.locale
    MaskPassword.symbols
    MaskPassword.enableLongNames
    MaskPassword.monthNames
    MaskPassword.weekNames
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

### Thank you for your donation. 
  > ETH Wallet : 0x03AA0D76BE8f547244c5A7410674f400142305b0
