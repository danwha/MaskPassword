import MaskPassword from 'maskPassword'

const rule = [
  'Sunrise in the east.',
  MaskPassword.shortYear,
  MaskPassword.numericMonth,
  'hot summer has come.'
]

const manager = new MaskPassword(rule)
const encrypt = manager.encryption()

for(let y = 2020; y <= 2030; y++){
  for(let m = 1; m <= 12; m++){
    const password = `Sunrise in the east.${right(y,2)}${right(m,2)}hot summer has come.`
    const decrypt = manager.decryption(encrypt, password)
    if(decrypt) console.log(MaskPassword.locale, password)
  }  
}

function right(value, size){
  let s = '0'.repeat(size) + value.toString();
  let r = s.substr(s.length - size, size);
  return r;
}