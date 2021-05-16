const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const {MONGOURI} = require('./keys');
// const requireLogin = require('./middlewares/requireLogin');


mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=>{
    console.log("Connected To MONGO!")
})
mongoose.connection.on('error', (err)=>{
    console.log("error while connecting",err)
})

require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

// const customMiddleware = (req, res, next)=>{
//     console.log("Middleware");
//     next();
// }
// // gCoTbHefTOe9wVdY
// // app.use(customMiddleware);

// app.get('/',customMiddleware,(req,res)=>{
//     res.send("Hello World")
// })
// app.get('/about',(req,res)=>{
//     res.send("Hello from about")
// })

app.listen(PORT, ()=>{
    console.log("Server running on ",PORT)
})

// app.use((req, res, next) => {
//     console.log('First Middleware');
//     next();
// });

// app.use((req, res, next) => {
//     // console.log('FFFFFF')
//     res.send('Hello from express!');
// });

// module.exports = app;