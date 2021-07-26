import React      from 'react';

import MaskPassword from './reactMaskPassword'

function App() {
  const testIdenty = 'testIdenty'
  const testRule = [
    'Sunrise',
    MaskPassword.shortYear,
    MaskPassword.numericMonth,
  ]
  const M = new MaskPassword(testRule)
  const E = M.encryption()
  const ES = Object.values(E).join('|')

  // save to localStorage
  localStorage[testIdenty] = ES

  // load from localStorage
  const encrypted = localStorage[testIdenty]
  const _encrypt = encrypted.split('|')
  const encrypt = {
    struct  : _encrypt[0],
    iv      : _encrypt[1],
    content : _encrypt[2]
  }

  const V = new MaskPassword()
  const M0 = V.decryption(encrypt, 'Sunrise2107', 9)
  const M1 = V.decryption(encrypt, 'Sunrise2108', 9)
  const M2 = V.decryption(encrypt, 'Sunrise2109', 9)
  console.log(M0, M1, M2)

  return (
    <div className="App">
    </div>
  )
}

export default App;
