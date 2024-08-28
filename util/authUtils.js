const bcrypt = require('bcrypt');
const saltRounds = 10;

// Function to hash a plain text password
const hashPassword = async (plainTextPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

// Function to compare a plain text password with a hashed password
const comparePassword = async (plainTextPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

module.exports = {
    hashPassword,
    comparePassword
};
