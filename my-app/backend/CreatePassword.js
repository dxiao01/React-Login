const bcrypt = require('bcrypt');

let password = bcrypt.hashSync('1234', 9);
console.log(password);