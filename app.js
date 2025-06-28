const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const USERNAME = 'admin';
const PASSWORD = 'secret';

const publicPath = path.join(__dirname, 'public');
const configPath = path.join(__dirname, 'config.json');
const layoutPath = path.join(__dirname, 'layout.json');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'dragdrop-secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.json());
app.use(express.static(publicPath));

function requireAuth(req, res, next) {
  if (req.session.loggedIn) return next();
  res.redirect('/login');
}

app.get('/login', (req, res) => {
  res.send(`
    <form method="POST">
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.send('Invalid login. <a href="/login">Try again</a>.');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/settings', requireAuth, (req, res) => {
  res.sendFile(path.join(publicPath, 'settings.html'));
});

app.get('/config', requireAuth, (req, res) => {
  if (fs.existsSync(configPath)) {
    res.type('json').send(fs.readFileSync(configPath));
  } else {
    res.json({ types: ["Router", "Switch", "PC"] });
  }
});

app.post('/config', requireAuth, (req, res) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Failed to save config:', err);
    res.status(500).send('Failed to save config');
  }
});

app.get('/layout', requireAuth, (req, res) => {
  if (fs.existsSync(layoutPath)) {
    res.type('json').send(fs.readFileSync(layoutPath));
  } else {
    res.json({ nodes: [], connections: [] });
  }
});

app.post('/save', requireAuth, (req, res) => {
  console.log('📥 Saving layout:', JSON.stringify(req.body, null, 2));
  try {
    fs.writeFileSync(layoutPath, JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Failed to save layout:', err);
    res.status(500).send('Failed to save layout');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
