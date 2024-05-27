const User = require('./user-model')

async function validateUsernameAndPassword(req, res, next) {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: 'username and password required' });
    }
    try {
        const [userExist] = await User.findBy({ username })
        if (userExist) {
            return res.status(400).json({ message: "username taken" })
        }else{
            next()
        }
    } catch (err) {
        next(err)
    }
}

function userNamePasswordBody(req, res, next){
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: 'username and password required' });
    }else{
        next()
    }
}

module.exports = {
    validateUsernameAndPassword,
    userNamePasswordBody
}