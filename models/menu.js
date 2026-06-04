import mongoose from 'mongoose';

// Define the menu schema
const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  taste: {
    type: String,
    enum: ['sweet', 'salty', 'sour'],
    required: true
  },
  is_drink: {
    type: Boolean,
    required: false
  },
  ingredients: {
    type: [String],
    required: false
  },
  number_of_orders: {
    type: Number,
    required: false
  }
});

// Create the menu model
const Menu = mongoose.model('Menu', menuSchema);

// Export the menu model
export default Menu;
