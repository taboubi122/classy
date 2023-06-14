const jwt=require("jsonwebtoken");
module.exports=()=>{
    return (req,res,next)=>{
        console.log("Authorization middelware");
        const token=req.headers["authorization"];
        if(!token){
            return res.status(401).send("acces denied")  
        } else{
            
            const tokenBody=token.slice(7);
            jwt.verify(tokenBody,'sECRTkeyS',(err,decoded)=>{
                if(err){
                    console.log(`JWT Error :${err}`);     
                    return res.status(401).send("error:Access Denied")   
             }

            })
             next();   
            }
    }
}