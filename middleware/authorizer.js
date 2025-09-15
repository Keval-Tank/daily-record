export const authorizer = (req, res, next) => {
    let auth = false;
        for(let i in req.headers){
            if(i === 'x-api-key'){
                auth = true;
            }
        }
        if(auth === false){
            return res.status(401).json({
                "msg" : "Unauthorized Access"
            });
        }
        next();
}

// export default authorizer