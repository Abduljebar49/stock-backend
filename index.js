const express = require('express')
const userRoute = require('./routes/auth-route');
const app = express();


app.use(express.json());
app.use('/api',userRoute.routes);
app.get('/',(req,res)=>{
    res.send("listening ...")
})

app.listen(3000,function(){
    console.log("listening on port 3000 ")
})