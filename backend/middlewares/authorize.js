const authorize = (req, res, next) => {
    if(req.user === undefined){
        console.log("You are not authorized for this page");
        
        return res.status(401).json({ msg: "You are not authorize for this page"});
    }

    next();
}

module.exports = { authorize };