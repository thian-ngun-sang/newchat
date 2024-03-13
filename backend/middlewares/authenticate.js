const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    let user;

    // return next() if there is no authorization header
    if(authorization === "" || authorization === null || authorization === undefined){
        return next();
    }

    const token = authorization.split(" ")[1];

    if(token === "" || token === null || token === "NULL" || token === "null" || token === undefined){
        return next();
    }

    // verify jwt token in try & catch block
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        const { user_id } = decodedToken;
        if(user_id !== undefined && user_id !== null){
            user = await User.findOne({ _id: user_id}, "_id").maxTimeMS(30000);
        }
    }catch(error){
        console.log("Invalid token");
        return next();
    }

    // add user in req body
    if(user){
        req.user = user;
        return next();
    }
    return next();
}

module.exports = { authenticate };
