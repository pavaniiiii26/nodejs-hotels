import Menu from '../models/menu.js' // Import the menu model
import express from 'express'
const router = express.Router()

//menu routes
//POST a menu
router.post('/', async (req, res) => {
  console.log('Received body:', req.body)

  try {
    const data = req.body
    const newMenu = new Menu(data)
    const savedMenu = await newMenu.save()

    console.log('Menu saved successfully:', savedMenu)
    res.status(201).json(savedMenu)

  } catch (err) {
    console.error('Error saving menu:', err)
    res.status(500).json({ error: 'Failed to save menu' })
  }
})

//GET all menu
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find()
    res.json(menus)
  } catch (err) {
    console.error('Error fetching menus:', err)
    res.status(500).json({ error: 'Failed to fetch menus' })
  }
})

router.get('/:taste', async (req, res) => {
  try {
    const taste = req.params.taste
    if (taste !== 'sweet' && taste !== 'salty' && taste !== 'sour') {
      res.status(400).json({ error: 'Invalid taste type' })
      return
    }
    const menus = await Menu.find({ taste: taste })
    console.log(`Menus with taste ${taste}:`, menus)
    res.json(menus)
  } catch (err) {
    console.error('Error fetching menus by taste:', err)
    res.status(500).json({ error: 'Failed to fetch menus by taste' })
  }
})

export default router;
