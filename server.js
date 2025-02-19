require('./src/db');

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'src')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages','list.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
