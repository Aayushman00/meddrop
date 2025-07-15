const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // i am using a secure key for JWT signing 

module.exports = function(req, res, next) {
    const authHeader = req.headers.authorization;

    // console.log('HEADERS:', req.headers);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }   

    const token = authHeader.split(' ')[1];
    try {   
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 

    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};