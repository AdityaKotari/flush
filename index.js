const express = require('express')
const app = express()

require('dotenv').config(); 

const router = (global.router = (express.Router()));
const port = process.env.PORT || 5000; 
var cors = require('cors')

// app.use(cors());
app.use(express.json());

app.use('/profile', require('./routes/profile.js'));
app.use('/toilet', require('./routes/toilet.js'));
app.use(router);

app.listen(port, () => {
    console.log(`Flush server listening at http://localhost:${port}`);
});
