// hashPassword.js
//
// This script generates a hashed password using bcrypt. You can pass the password
// as a command line argument. If no password is provided, it will use a default value.
//
// Usage:
// node scripts/hashPassword.js [your_password]

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Default password (you can change this to any default value)
const defaultPassword = 'default_password';

// Get the password from command line arguments or use the default
const args = process.argv.slice(2);
const password = args[0] || defaultPassword;

console.log(`Using password: ${password}`);

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed Password:', hash);
    }
});
