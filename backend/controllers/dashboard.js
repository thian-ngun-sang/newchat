const index = (req, res) => {
    // console.log(req.user);
    return res.status(200).json({msg: "Hello from new chat dashboard"});
}

module.exports = { index };