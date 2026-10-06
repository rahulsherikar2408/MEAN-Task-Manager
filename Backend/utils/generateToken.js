import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "7d" });
}

export default generateToken;