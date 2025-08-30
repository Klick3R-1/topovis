# Network Wiki Implementation

## Overview

The Network Wiki is a feature that automatically generates documentation pages for network topologies in a tree-like structure. It provides an organized way to view and navigate network information, with each node having its own dedicated page. The wiki has been significantly enhanced in v2.1.0 with improved styling, navigation, and user experience.

## Features

### 🌳 Tree Structure Navigation
- **Hierarchical View**: Networks are displayed in a tree structure based on connections
- **Auto-generated Pages**: Each node automatically gets its own wiki page
- **Breadcrumb Navigation**: Easy navigation between connected nodes
- **Expanded by Default**: Tree nodes are expanded by default for immediate visibility
- **ASCII-Style Styling**: Clean, professional tree appearance with proper indentation
- **Active Node Highlighting**: Selected nodes are clearly underlined

### 📚 Auto-generated Content
- **Node Information**: Type, name, IP address, and documentation
- **Simplified Display**: Clean, focused content showing essential information
- **Documentation Support**: Full markdown rendering for node documentation
- **Network Context**: Displays which network the node belongs to

### ⚙️ Root Node Configuration
- **Manual Root Selection**: Users can specify which node should be the root/input
- **Settings Integration**: Configure root nodes through the Settings page
- **Fallback Detection**: Auto-detects root if none is configured

### 🔐 Access Control
- **User Permissions**: Only accessible to users with network access
- **Network Sharing**: Respects network access settings (private/shared/public)
- **Role-based Access**: Admins can configure any network, users only their own

### 🎨 Enhanced User Experience (v2.1.0)
- **Professional Styling**: Dark theme matching the main application
- **Responsive Design**: Works seamlessly on all screen sizes
- **Interactive Elements**: Smooth animations and hover effects
- **Consistent Navigation**: Unified header design across all pages

## How to Use

### 1. Access the Wiki
- Navigate to `/wiki` or click "📚 Network Wiki" in the main navigation header
- Must be logged in and have access to at least one network

### 2. Select a Network
- Use the dropdown to select which network to view
- The wiki will automatically load the network structure
- Tree navigation is expanded by default for immediate visibility

### 3. Navigate the Tree
- **Left Sidebar**: Shows the network hierarchy in tree format
- **Click Nodes**: Navigate to individual node pages
- **Tree Styling**: Clean ASCII-style tree with proper indentation
- **Active State**: Selected nodes are clearly underlined

### 4. View Node Pages
- **Main Content**: Displays essential node information (type, name, IP)
- **Documentation Section**: Full markdown support for node documentation
- **Breadcrumbs**: Shows navigation path from network root to current node
- **Simplified Layout**: Focused on essential information without clutter

### 5. Configure Root Node (Optional)
- Go to **Network Editor** → **🌐 Network Settings** (for the specific network)
- In the modal, scroll down to **Root Node Configuration**
- Choose which node should be the root/input from the dropdown
- Click "Save Root Node"

## Technical Implementation

### Database Schema
```sql
-- New table for storing root node configuration
CREATE TABLE network_root_nodes (
  id TEXT PRIMARY KEY,
  network_id TEXT NOT NULL,
  root_node_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (network_id) REFERENCES networks (id) ON DELETE CASCADE,
  FOREIGN KEY (root_node_id) REFERENCES nodes (id) ON DELETE CASCADE
);
```

### API Endpoints
- `GET /wiki` - Serves the wiki HTML page
- `GET /wiki/network/:networkId` - Gets network data with hierarchy
- `GET /wiki/node/:nodeId` - Gets individual node data
- `POST /networks/:networkId/root-node` - Sets the root node for a network

### Root Node Detection Logic
1. **Priority 1**: User-configured root node (from settings)
2. **Priority 2**: Auto-detected root (node with no incoming connections)
3. **Fallback**: First node with outgoing connections

### Tree Generation Algorithm
- **buildTreeNode()**: Creates tree structure with proper hierarchy
- **getNodeChildren()**: Determines child nodes based on outgoing connections
- **Default Expansion**: All tree nodes are expanded by default
- **Active State**: Root node is automatically marked as active on load

## File Structure

```
public/
├── wiki.html          # Enhanced wiki interface with improved styling
├── index.html         # Updated with standardized navigation and wiki integration
├── admin.html         # Updated with consistent navigation
└── settings.html      # General settings (node types, templates)

app.js                 # Backend API endpoints and logic
```

## User Experience

### For Network Administrators
- Configure which node represents the network entry point
- Set logical hierarchy for documentation
- Control how the wiki displays network structure
- Professional, enterprise-grade interface

### For Network Users
- Browse network documentation in organized format
- Understand network topology and connections
- Navigate between related devices easily
- Clean, focused content display

### For Read-only Users
- View network documentation without editing capabilities
- Access shared networks through the wiki interface
- Professional, accessible interface design

## Recent Enhancements (v2.1.0)

### 🎨 Visual Improvements
- **Dark Theme**: Professional dark color scheme matching main application
- **ASCII Tree Styling**: Clean, professional tree appearance
- **Consistent Navigation**: Unified header design across all pages
- **Responsive Layout**: Works perfectly on all devices

### 🔧 Functional Improvements
- **Tree Expansion**: All nodes expanded by default for immediate visibility
- **Active Node Highlighting**: Selected nodes are clearly underlined
- **Simplified Content**: Focused on essential information
- **Documentation Support**: Enhanced markdown rendering

### 🐛 Bug Fixes
- **Tree Navigation**: Fixed CSS issues preventing proper display
- **Documentation Detection**: Resolved parsing issues
- **Navigation Consistency**: Unified design across all application pages
- **User Experience**: Improved overall usability and appearance

## Benefits

1. **Documentation**: Automatic generation of network documentation
2. **Navigation**: Intuitive tree-based navigation with professional styling
3. **Consistency**: Standardized format for all networks
4. **Accessibility**: Easy access to network information for all users
5. **Maintenance**: Self-updating as network topology changes
6. **Professional Appearance**: Enterprise-grade interface design
7. **User Experience**: Enhanced usability and visual appeal

## Future Enhancements

- **Search Functionality**: Search across all nodes and properties
- **Export Options**: PDF/HTML export of network documentation
- **Custom Fields**: User-defined properties for nodes
- **Version History**: Track changes to network topology
- **Comments/Notes**: Add documentation to individual nodes
- **Advanced Tree Options**: Customizable tree display preferences
- **Filtering**: Filter nodes by type, properties, or connections
