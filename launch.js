const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    app.use(express.static(__dirname));
    res.sendFile(__dirname  +'/index.html');
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})