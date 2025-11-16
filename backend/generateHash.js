const bcrypt = require('bcryptjs');

const password = 'password123';

console.log('Generating bcrypt hash for password:', password);
console.log('Please wait...\n');

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('✅ Generated hash:');
  console.log(hash);
  console.log('\n📋 Copy this hash and use it in the seed.sql file');
  console.log('Replace all the placeholder hashes with this one');
});
