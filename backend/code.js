// app.js
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Todo Schema
const todoSchema = new mongoose.Schema({
  encryptedText: String,
  iv: String
});

const Todo = mongoose.model('Todo', todoSchema);

// Route to Add a Todo
app.post('/addTodo', (req, res) => {
  const { secretKey, text } = req.body;
  if (!secretKey || !text) return res.status(400).json({ error: 'Secret key and text are required' });

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const newTodo = new Todo({ encryptedText: encrypted, iv: iv.toString('hex') });
  newTodo.save()
    .then(() => res.status(201).json({ message: 'Todo added successfully' }))
    .catch((err) => res.status(500).json({ error: 'Failed to save todo' }));
});

// Route to Decrypt Todos
app.post('/decryptTodos', (req, res) => {
  const { secretKey } = req.body;
  if (!secretKey) return res.status(400).json({ error: 'Secret key is required' });

  Todo.find().then(todos => {
    try {
      const decryptedTodos = todos.map(todo => {
        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secretKey), Buffer.from(todo.iv, 'hex'));
        let decrypted = decipher.update(todo.encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return { text: decrypted };
      });
      res.json(decryptedTodos);
    } catch (error) {
      res.status(400).json({ error: 'Failed to decrypt todos, wrong key' });
    }
  }).catch(err => res.status(500).json({ error: 'Failed to fetch todos' }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


























app.post('/addTodo', (req, res) => {
  const { secretKey, description, category, amount } = req.body;
  if (!secretKey || !description || !category || !amount) {
    return res.status(400).json({ error: 'Secret key and all fields are required' });
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secretKey), iv);

  // Encrypt each value
  const encryptValue = (value) => {
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  };

  const encryptedTodo = {
    encryptedDescription: encryptValue(description),
    encryptedCategory: encryptValue(category),
    encryptedAmount: encryptValue(amount),
    iv: iv.toString('hex')
  };

  const newTodo = new Todo(encryptedTodo);
  newTodo.save()
    .then(() => res.status(201).json({ message: 'Todo added successfully' }))
    .catch((err) => res.status(500).json({ error: 'Failed to save todo' }));
});

