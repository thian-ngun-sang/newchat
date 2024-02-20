const internalError = (req, res, error, next) => {
    console.log("Internal error", error);
    return res.status(500).json({msg: "Internal error Found"});
}

module.exports = { internalError };