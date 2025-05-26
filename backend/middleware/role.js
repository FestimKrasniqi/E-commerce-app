
const allowRoles = (...roles) => {

    return (req, res, next) => {
       
        if (!req.user || !req.user.role) {
        return res.status(403).json({ message: 'Access denied' });
        }
    
        if (roles.includes(req.user.role)) {
        return next();
        }
    
        return res.status(403).json({ message: 'Access denied' });
    };
}

exports.allowRoles = allowRoles;