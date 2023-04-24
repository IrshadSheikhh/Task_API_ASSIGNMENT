const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

let tasks = [];
let currentId = 1;

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/v1/tasks', (req, res) => {
    const taskList = Array.isArray(req.body.tasks) ? req.body.tasks : [req.body];
    const createdTasks = taskList.map(task => {
      const newTask = {
        id: currentId,
        title: task.title,
        is_completed: task.is_completed || false
      };
      tasks.push(newTask);
      currentId++;
      return { id: newTask.id };
    });
  
    if (taskList.length === 1) {
      res.status(201).json({ id: createdTasks[0].id });
    } else {
      res.status(201).json({ tasks: createdTasks });
    }
  });
  
  
  

app.get('/v1/tasks', (req, res) => {
    const responseTasks = tasks.map(task => {
      return {
        id: task.id,
        title: task.title,
        is_completed: task.is_completed
      }
    });
    res.status(200).json({ tasks: responseTasks });
  });

app.get('/v1/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    res.status(404).json({ error: 'There is no task at that id' });
  } else {
    res.status(200).json(task);
  }
});

app.put('/v1/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    res.status(404).json({ error: 'There is no task at that id' });
  } else {
    task.title = req.body.title || task.title;
    task.is_completed = req.body.is_completed || task.is_completed;
    res.status(204).send();
  }
});

app.delete('/v1/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    res.status(204).send();
  } else {
    tasks.splice(index, 1);
    res.status(204).send();
  }
});



app.delete('/v1/tasks', (req, res) => {
  const taskList = req.body.tasks;
  taskList.forEach(task => {
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  });
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
