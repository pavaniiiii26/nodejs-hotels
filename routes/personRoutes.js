import Person from '../models/person.js' // Import the person model
import express from 'express'
const router = express.Router()

//person routes

//POST a person
router.post('/', async (req, res) => {
  console.log('Received body:', req.body)

  try {
    const data = req.body
    const newPerson = new Person(data)
    const savedPerson = await newPerson.save()

    console.log('Person saved successfully:', savedPerson)
    res.status(201).json(savedPerson)
  } catch (err) {
    console.error('Error saving person:', err)
    res.status(500).json({ error: 'Failed to save person' })
  }
})


//GET all person
router.get('/', async (req, res) => {
  try {
    const people = await Person.find()
    res.json(people)
  } catch (err) {
    console.error('Error fetching people:', err)
    res.status(500).json({ error: 'Failed to fetch people' })
  }
})

router.get('/:work', async (req, res) => {
  try {
    const work = req.params.work
    if (work !== 'chef' && work !== 'waiter' && work !== 'manager') {
      res.status(400).json({ error: 'Invalid work type' })
      return
    }
    const people = await Person.find({ work: work })
    console.log(`People with work ${work}:`, people)
    res.json(people)
  } catch (err) {
    console.error('Error fetching people by work:', err)
    res.status(500).json({ error: 'Failed to fetch people by work' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const personId = req.params.id
    const updateData = req.body

    const updatedPerson = await Person.findByIdAndUpdate(personId, updateData,
         { new: true, runValidators: true }
        )
    console.log('Update data:', updateData)
    
    if (!updatedPerson) {
      res.status(404).json({ error: 'Person not found' })
      return
    }

    console.log('Person updated successfully:', updatedPerson)
    res.json(updatedPerson)
  } catch (err) {
    console.error('Error updating person:', err)
    res.status(500).json({ error: 'Failed to update person' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const personId = req.params.id

    const deletedPerson = await Person.findByIdAndDelete(personId)

    if (!deletedPerson) {
      res.status(404).json({ error: 'Person not found' })
      return
    }

    console.log('Person deleted successfully:', deletedPerson)
    res.json({ message: 'Person deleted successfully' })
  } catch (err) {
    console.error('Error deleting person:', err)
    res.status(500).json({ error: 'Failed to delete person' })
  }
})

export default router;
