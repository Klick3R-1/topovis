const fs = require('fs');
const path = require('path');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Network Editor</title>
  <style>
    body { font-family: sans-serif; margin: 0; }
    #sidebar { width: 200px; background: #f0f0f0; padding: 1em; float: left; height: 100vh; box-sizing: border-box; }
    #canvas { margin-left: 200px; height: 100vh; position: relative; background: #fff; overflow: hidden; }
    .node { width: 100px; padding: 8px; text-align: center; border: 1px solid #aaa; background: #e0e0ff; position: absolute; cursor: move; }
    .palette-item { margin: 10px 0; padding: 8px; background: #ccc; cursor: grab; border: 1px solid #888; }
  </style>
</head>
<body>
  <div id="sidebar">
    <h3>Palette</h3>
    <div class="palette-item" draggable="true" data-type="Router">Router</div>
    <div class="palette-item" draggable="true" data-type="Switch">Switch</div>
    <div class="palette-item" draggable="true" data-type="PC">PC</div>
    <p><a href="/logout">Logout</a></p>
  </div>
  <div id="canvas" ondrop="drop(event)" ondragover="allowDrop(event)"></div>

  <script>
    function allowDrop(ev) {
      ev.preventDefault();
    }

    document.querySelectorAll('.palette-item').forEach(item => {
      item.addEventListener('dragstart', ev => {
        ev.dataTransfer.setData(\"text/plain\", ev.target.dataset.type);
      });
    });

    function drop(ev) {
      ev.preventDefault();
      const type = ev.dataTransfer.getData(\"text/plain\");
      const node = document.createElement('div');
      node.className = 'node';
      node.textContent = type;
      node.style.left = ev.clientX + 'px';
      node.style.top = ev.clientY + 'px';

      node.onmousedown = function(e) {
        const offsetX = e.clientX - node.offsetLeft;
        const offsetY = e.clientY - node.offsetTop;
        function moveHandler(ev) {
          node.style.left = (ev.clientX - offsetX) + 'px';
          node.style.top = (ev.clientY - offsetY) + 'px';
        }
        function upHandler() {
          document.removeEventListener('mousemove', moveHandler);
          document.removeEventListener('mouseup', upHandler);
        }
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
      }

      document.getElementById('canvas').appendChild(node);
    }
  </script>
</body>
</html>`;

const outDir = path.join(__dirname, 'public');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);

console.log('✅ index.html generated in /public');