import express from 'express'
import db from './db.js' // Import the database connection


import personRoutes from './routes/personRoutes.js' // Import person routes
import menuRoutes from './routes/menuRoutes.js' // Import menu routes

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the restaurant API!')
})

app.use('/person', personRoutes) // Use person routes
app.use('/menu', menuRoutes) // Use menu routes 

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
