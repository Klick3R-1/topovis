const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

const USERNAME = 'admin';
const PASSWORD = 'secret';

const publicPath = path.join(__dirname, 'public');
const configPath = path.join(__dirname, 'config.json');
const dbPath = path.join(__dirname, 'database', 'topovis.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  // Create users table with roles
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user', 'readonly')),
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  )`);
  
  // Create networks table
  db.run(`CREATE TABLE IF NOT EXISTS networks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'custom',
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
  
  // Create nodes table
  db.run(`CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT,
    ip TEXT,
    x REAL NOT NULL,
    y REAL NOT NULL,
    properties TEXT,
    network_id TEXT NOT NULL,
    FOREIGN KEY (network_id) REFERENCES networks (id) ON DELETE CASCADE
  )`);
  
  // Create connections table
  db.run(`CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    from_node_id TEXT NOT NULL,
    to_node_id TEXT NOT NULL,
    type TEXT DEFAULT 'ethernet',
    properties TEXT,
    network_id TEXT NOT NULL,
    FOREIGN KEY (from_node_id) REFERENCES nodes (id) ON DELETE CASCADE,
    FOREIGN KEY (to_node_id) REFERENCES nodes (id) ON DELETE CASCADE,
    FOREIGN KEY (network_id) REFERENCES networks (id) ON DELETE CASCADE
  )`);
  
  // Insert default admin user if not exists
  const hashedPassword = bcrypt.hashSync(PASSWORD, 10);
  db.run(`INSERT OR IGNORE INTO users (id, username, password, role, email) VALUES (?, ?, ?, ?, ?)`, 
    ['admin-1', USERNAME, hashedPassword, 'admin', 'admin@topovis.local']);
});

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

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session.loggedIn) {
      return res.redirect('/login');
    }
    
    // Get user role from database
    db.get('SELECT role FROM users WHERE id = ?', [req.session.userId], (err, user) => {
      if (err || !user) {
        return res.redirect('/login');
      }
      
      if (roles.includes(user.role)) {
        next();
      } else {
        res.status(403).send('Access denied. Insufficient permissions.');
      }
    });
  };
}

function requireAdmin(req, res, next) {
  return requireRole(['admin'])(req, res, next);
}

function requireUserOrAdmin(req, res, next) {
  return requireRole(['admin', 'user'])(req, res, next);
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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.loggedIn = true;
      req.session.userId = user.id;
      // Update last login time
      db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
      res.redirect('/');
    } else {
      res.send('Invalid login. <a href="/login">Try again</a>.');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.send('Login error. <a href="/login">Try again</a>.');
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

app.get('/admin', requireAdmin, (req, res) => {
  res.sendFile(path.join(publicPath, 'admin.html'));
});

// Get current user info
app.get('/user/info', requireAuth, (req, res) => {
  const userId = req.session.userId;
  
  db.get('SELECT id, username, role, email, created_at, last_login FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      res.status(500).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  });
});

// Get all networks for current user
app.get('/networks', requireAuth, (req, res) => {
  const userId = req.session.userId;
  
  // Get user role to determine access
  db.get('SELECT role FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'User not found' });
    }
    
    if (user.role === 'admin') {
      // Admins can see all networks
      db.all('SELECT n.*, u.username as owner FROM networks n JOIN users u ON n.user_id = u.id ORDER BY n.created_at DESC', (err, rows) => {
        if (err) {
          console.error('Failed to fetch networks:', err);
          res.status(500).json({ error: 'Failed to fetch networks' });
        } else {
          res.json(rows);
        }
      });
    } else {
      // Regular users only see their own networks
      db.all('SELECT * FROM networks WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
        if (err) {
          console.error('Failed to fetch networks:', err);
          res.status(500).json({ error: 'Failed to fetch networks' });
        } else {
          res.json(rows);
        }
      });
    }
  });
});

// Create new network
app.post('/networks', requireUserOrAdmin, (req, res) => {
  const { name, description, type } = req.body;
  const userId = req.session.userId;
  const networkId = `network-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  db.run(
    'INSERT INTO networks (id, name, description, type, user_id) VALUES (?, ?, ?, ?, ?)',
    [networkId, name, description || '', type || 'custom', userId],
    function(err) {
      if (err) {
        console.error('Failed to create network:', err);
        res.status(500).json({ error: 'Failed to create network' });
      } else {
        res.json({ id: networkId, name, description, type, userId });
      }
    }
  );
});

// Create network from template
app.post('/networks/template', requireUserOrAdmin, (req, res) => {
  const { name, template } = req.body;
  const userId = req.session.userId;
  const networkId = `network-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create network first
  db.run(
    'INSERT INTO networks (id, name, description, type, user_id) VALUES (?, ?, ?, ?, ?)',
    [networkId, name, `Template: ${template}`, template, userId],
    function(err) {
      if (err) {
        console.error('Failed to create template network:', err);
        res.status(500).json({ error: 'Failed to create template network' });
      } else {
        // Add template nodes and connections
        const templateData = getTemplateData(template);
        insertTemplateData(networkId, templateData, res);
      }
    }
  );
});

// Get network layout
app.get('/networks/:id/layout', requireAuth, (req, res) => {
  const networkId = req.params.id;
  const userId = req.session.userId;
  
  // Get user role and verify network access
  db.get('SELECT role FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'User not found' });
    }
    
    let query, params;
    if (user.role === 'admin') {
      // Admins can access any network
      query = 'SELECT id FROM networks WHERE id = ?';
      params = [networkId];
    } else {
      // Regular users can only access their own networks
      query = 'SELECT id FROM networks WHERE id = ? AND user_id = ?';
      params = [networkId, userId];
    }
    
    db.get(query, params, (err, network) => {
      if (err || !network) {
        res.status(404).json({ error: 'Network not found' });
        return;
      }
      
      // Get nodes and connections
      db.all('SELECT * FROM nodes WHERE network_id = ?', [networkId], (err, nodes) => {
        if (err) {
          res.status(500).json({ error: 'Failed to fetch nodes' });
          return;
        }
        
        db.all('SELECT * FROM connections WHERE network_id = ?', [networkId], (err, connections) => {
          if (err) {
            res.status(500).json({ error: 'Failed to fetch connections' });
            return;
          }
          
          // Convert database format to frontend format
          const layoutData = {
            nodes: nodes.map(node => ({
              id: node.id,
              type: node.type,
              name: node.name || '',
              ip: node.ip || '',
              left: node.x + 'px',
              top: node.y + 'px',
              properties: node.properties ? JSON.parse(node.properties) : {}
            })),
            connections: connections.map(conn => ({
              from: conn.from_node_id,
              to: conn.to_node_id,
              type: conn.type,
              properties: conn.properties ? JSON.parse(conn.properties) : {}
            }))
          };
          
          res.json(layoutData);
        });
      });
    });
  });
});

// Save network layout
app.post('/networks/:id/save', requireUserOrAdmin, (req, res) => {
  const networkId = req.params.id;
  const userId = req.session.userId;
  const { nodes, connections } = req.body;
  
  // Get user role and verify network access
  db.get('SELECT role FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'User not found' });
    }
    
    let query, params;
    if (user.role === 'admin') {
      // Admins can edit any network
      query = 'SELECT id FROM networks WHERE id = ?';
      params = [networkId];
    } else {
      // Regular users can only edit their own networks
      query = 'SELECT id FROM networks WHERE id = ? AND user_id = ?';
      params = [networkId, userId];
    }
    
    db.get(query, params, (err, network) => {
      if (err || !network) {
        res.status(404).json({ error: 'Network not found' });
        return;
      }
      
      // Clear existing data
      db.run('DELETE FROM nodes WHERE network_id = ?', [networkId], (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to clear nodes' });
          return;
        }
        
        db.run('DELETE FROM connections WHERE network_id = ?', [networkId], (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to clear connections' });
            return;
          }
          
          // Insert new nodes
          const nodeStmt = db.prepare('INSERT INTO nodes (id, type, name, ip, x, y, properties, network_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
          nodes.forEach(node => {
            const x = parseFloat(node.left);
            const y = parseFloat(node.top);
            nodeStmt.run([
              node.id,
              node.type,
              node.name || '',
              node.ip || '',
              x,
              y,
              JSON.stringify(node.properties || {}),
              networkId
            ]);
          });
          nodeStmt.finalize();
          
          // Insert new connections
          const connStmt = db.prepare('INSERT INTO connections (id, from_node_id, to_node_id, type, properties, network_id) VALUES (?, ?, ?, ?, ?, ?)');
          connections.forEach(conn => {
            const connId = `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            connStmt.run([
              connId,
              conn.from,
              conn.to,
              conn.type || 'ethernet',
              JSON.stringify(conn.properties || {}),
              networkId
            ]);
          });
          connStmt.finalize();
          
          // Update network timestamp
          db.run('UPDATE networks SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [networkId]);
          
          res.json({ success: true });
        });
      });
    });
  });
});

// Export network
app.get('/networks/:id/export', requireAuth, (req, res) => {
  const networkId = req.params.id;
  const userId = req.session.userId;
  
  // Get user role and verify network access
  db.get('SELECT role FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'User not found' });
    }
    
    let query, params;
    if (user.role === 'admin') {
      // Admins can export any network
      query = 'SELECT * FROM networks WHERE id = ?';
      params = [networkId];
    } else {
      // Regular users can only export their own networks
      query = 'SELECT * FROM networks WHERE id = ? AND user_id = ?';
      params = [networkId, userId];
    }
    
    // Get network with nodes and connections
    db.get(query, params, (err, network) => {
      if (err || !network) {
        res.status(404).json({ error: 'Network not found' });
        return;
      }
      
      db.all('SELECT * FROM nodes WHERE network_id = ?', [networkId], (err, nodes) => {
        if (err) {
          res.status(500).json({ error: 'Failed to fetch nodes' });
          return;
        }
        
        db.all('SELECT * FROM connections WHERE network_id = ?', [networkId], (err, connections) => {
          if (err) {
            res.status(500).json({ error: 'Failed to fetch connections' });
            return;
          }
          
          const exportData = {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            network: {
              name: network.name,
              description: network.description,
              type: network.type,
              nodes: nodes.map(node => ({
                id: node.id,
                type: node.type,
                name: node.name,
                ip: node.ip,
                x: node.x,
                y: node.y,
                properties: node.properties ? JSON.parse(node.properties) : {}
              })),
              connections: connections.map(conn => ({
                from: conn.from_node_id,
                to: conn.to_node_id,
                type: conn.type,
                properties: conn.properties ? JSON.parse(conn.properties) : {}
              }))
            }
          };
          
          res.json(exportData);
        });
      });
    });
  });
});

// Delete network
app.delete('/networks/:id', requireUserOrAdmin, (req, res) => {
  const networkId = req.params.id;
  const userId = req.session.userId;
  
  // Get user role and verify network access
  db.get('SELECT role FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'User not found' });
    }
    
    let query, params;
    if (user.role === 'admin') {
      // Admins can delete any network
      query = 'SELECT id FROM networks WHERE id = ?';
      params = [networkId];
    } else {
      // Regular users can only delete their own networks
      query = 'SELECT id FROM networks WHERE id = ? AND user_id = ?';
      params = [networkId, userId];
    }
    
    db.get(query, params, (err, network) => {
      if (err || !network) {
        return res.status(404).json({ error: 'Network not found' });
      }
      
      db.run('DELETE FROM networks WHERE id = ?', [networkId], function(err) {
        if (err) {
          console.error('Failed to delete network:', err);
          res.status(500).json({ error: 'Failed to delete network' });
        } else {
          res.json({ success: true });
        }
      });
    });
  });
});

// User management endpoints (admin only)
app.get('/admin/users', requireAdmin, (req, res) => {
  db.all('SELECT id, username, role, email, created_at, last_login FROM users ORDER BY created_at DESC', (err, users) => {
    if (err) {
      console.error('Failed to fetch users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    } else {
      res.json(users);
    }
  });
});

app.post('/admin/users', requireAdmin, async (req, res) => {
  const { username, password, role, email } = req.body;
  
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required' });
  }
  
  if (!['admin', 'user', 'readonly'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    db.run(
      'INSERT INTO users (id, username, password, role, email) VALUES (?, ?, ?, ?, ?)',
      [userId, username, hashedPassword, role, email || ''],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Username already exists' });
          } else {
            console.error('Failed to create user:', err);
            res.status(500).json({ error: 'Failed to create user' });
          }
        } else {
          res.json({ id: userId, username, role, email });
        }
      }
    );
  } catch (error) {
    console.error('Password hashing error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/admin/users/:id', requireAdmin, async (req, res) => {
  const userId = req.params.id;
  const { username, role, email } = req.body;
  
  if (!username || !role) {
    return res.status(400).json({ error: 'Username and role are required' });
  }
  
  if (!['admin', 'user', 'readonly'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  db.run(
    'UPDATE users SET username = ?, role = ?, email = ? WHERE id = ?',
    [username, role, email || '', userId],
    function(err) {
      if (err) {
        console.error('Failed to update user:', err);
        res.status(500).json({ error: 'Failed to update user' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ success: true });
      }
    }
  );
});

app.delete('/admin/users/:id', requireAdmin, (req, res) => {
  const userId = req.params.id;
  
  // Prevent admin from deleting themselves
  if (userId === req.session.userId) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  
  db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
    if (err) {
      console.error('Failed to delete user:', err);
      res.status(500).json({ error: 'Failed to delete user' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/admin/users/:id/reset-password', requireAdmin, async (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;
  
  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], function(err) {
      if (err) {
        console.error('Failed to reset password:', err);
        res.status(500).json({ error: 'Failed to reset password' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ success: true });
      }
    });
  } catch (error) {
    console.error('Password hashing error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Legacy endpoints for backward compatibility
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

// Template data functions
function getTemplateData(templateType) {
  const templates = {
    lan: {
      nodes: [
        { type: 'Router', name: 'Main Router', ip: '192.168.1.1', x: 100, y: 100 },
        { type: 'Switch', name: 'Core Switch', ip: '192.168.1.2', x: 300, y: 100 },
        { type: 'Switch', name: 'Floor Switch', ip: '192.168.1.3', x: 500, y: 100 },
        { type: 'PC', name: 'Workstation 1', ip: '192.168.1.10', x: 100, y: 300 },
        { type: 'PC', name: 'Workstation 2', ip: '192.168.1.11', x: 300, y: 300 },
        { type: 'PC', name: 'Workstation 3', ip: '192.168.1.12', x: 500, y: 300 }
      ],
      connections: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 }
      ]
    },
    hetzner: {
      nodes: [
        { type: 'Load Balancer', name: 'LB-01', ip: '10.0.1.1', x: 100, y: 100 },
        { type: 'Server', name: 'Web-01', ip: '10.0.1.10', x: 300, y: 100 },
        { type: 'Server', name: 'Web-02', ip: '10.0.1.11', x: 500, y: 100 },
        { type: 'Database', name: 'DB-01', ip: '10.0.1.20', x: 300, y: 300 },
        { type: 'Server', name: 'App-01', ip: '10.0.1.30', x: 500, y: 300 }
      ],
      connections: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 3 },
        { from: 3, to: 4 }
      ]
    },
    office: {
      nodes: [
        { type: 'Firewall', name: 'FW-01', ip: '10.0.0.1', x: 100, y: 100 },
        { type: 'Router', name: 'Core Router', ip: '10.0.0.2', x: 300, y: 100 },
        { type: 'Switch', name: 'VLAN-10', ip: '10.0.10.1', x: 100, y: 300 },
        { type: 'Switch', name: 'VLAN-20', ip: '10.0.20.1', x: 300, y: 300 },
        { type: 'Switch', name: 'VLAN-30', ip: '10.0.30.1', x: 500, y: 300 },
        { type: 'PC', name: 'Admin PC', ip: '10.0.10.10', x: 100, y: 500 },
        { type: 'PC', name: 'User PC', ip: '10.0.20.10', x: 300, y: 500 },
        { type: 'PC', name: 'Guest PC', ip: '10.0.30.10', x: 500, y: 500 }
      ],
      connections: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 6 },
        { from: 4, to: 7 }
      ]
    }
  };
  
  return templates[templateType] || templates.lan;
}

function insertTemplateData(networkId, templateData, res) {
  // Insert nodes
  const nodeStmt = db.prepare('INSERT INTO nodes (id, type, name, ip, x, y, properties, network_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const nodeIds = [];
  
  templateData.nodes.forEach((node, index) => {
    const nodeId = `node-${Date.now()}-${index}`;
    nodeIds.push(nodeId);
    nodeStmt.run([
      nodeId,
      node.type,
      node.name,
      node.ip,
      node.x,
      node.y,
      JSON.stringify({}),
      networkId
    ]);
  });
  nodeStmt.finalize();
  
  // Insert connections - map the array indices to actual node IDs
  const connStmt = db.prepare('INSERT INTO connections (id, from_node_id, to_node_id, type, properties, network_id) VALUES (?, ?, ?, ?, ?, ?)');
  
  templateData.connections.forEach((conn, index) => {
    const connId = `conn-${Date.now()}-${index}`;
    // Map the array indices to the actual node IDs
    const fromNodeId = nodeIds[conn.from];
    const toNodeId = nodeIds[conn.to];
    
    if (fromNodeId && toNodeId) {
      connStmt.run([
        connId,
        fromNodeId,
        toNodeId,
        'ethernet',
        JSON.stringify({}),
        networkId
      ]);
    } else {
      console.error(`Invalid connection: from=${conn.from}, to=${conn.to}, nodeIds=${nodeIds}`);
    }
  });
  connStmt.finalize();
  
  res.json({ success: true, networkId });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Database initialized at ${dbPath}`);
});
