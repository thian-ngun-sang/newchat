const notFound = (req, res, next) => {
    
    return res.status(400).json({msg: "URL Not Found"});
}

module.exports = { notFound };