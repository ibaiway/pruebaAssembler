import 'dotenv/config'
import connect from './database/db.js'
import app from './app.js'

const PORT = process.env.PORT || 3000

connect()
  .then(() => console.log('DB Connected'))
  .catch((e) => console.log(`Error in DB: ${e}`))

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})
