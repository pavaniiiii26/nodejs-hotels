import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  taste: {
    type: String,
    enum: ['sweet', 'salty', 'sour'],
    required: true
  },
  is_drink: {
    type: Boolean,
    default: false
  },
  ingredients: {
    type: [String],
    default: []
  },
  number_of_orders: {
    type: Number,
    default: 0,
    min: [0, 'Number of orders cannot be negative']
  },
  photo: {
    type: String // Store the file path or URL of the uploaded photo
  }
});

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;