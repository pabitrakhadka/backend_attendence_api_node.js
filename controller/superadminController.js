// Import crypto using ES module syntax
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
 
// Function to hash a password
function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex'); // 'hex' encoding for a hexadecimal string
}

// Function to check if entered password matches the stored hashed password
function verifyPassword(enteredPassword, storedHashedPassword) {
  const hashedEnteredPassword = hashPassword(enteredPassword);
  return hashedEnteredPassword === storedHashedPassword;
}
async function generateToken(){
try {
  const token=jwt.sign({id:5},"qwertyuiopasdfghjklzxcvbnmqwertyuio");
  console.log(token);
  return token
} catch (error) {
  console.log('error');
}
}
// Exporting the functions
export {
  hashPassword,
  verifyPassword,
  generateToken
};
