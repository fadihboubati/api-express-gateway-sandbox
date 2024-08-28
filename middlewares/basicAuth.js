const { comparePassword } = require('../util/authUtils');

// Middleware for basic authentication
const basicAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.status(401).send('Missing or incorrect Authorization header');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== process.env.BASIC_AUTH_USERNAME) {
        return res.status(401).send('Invalid username or password');
    }

    // const isPasswordValid = await bcrypt.compare(password, process.env.BASIC_AUTH_PASSWORD);
    const isPasswordValid = await comparePassword(password, process.env.BASIC_AUTH_PASSWORD);

    if (!isPasswordValid) {
        return res.status(401).send('Invalid username or password');
    }

    next();
};

module.exports = basicAuth;
