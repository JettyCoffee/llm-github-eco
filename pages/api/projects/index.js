// pages/api/projects/index.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  try {
    if (!fs.existsSync(dataDir)) {
      console.error('Data directory does not exist:', dataDir);
      return res.status(404).json({ error: 'Data directory not found' });
    }

    const projects = fs.readdirSync(dataDir).filter(file => {
      return fs.statSync(path.join(dataDir, file)).isDirectory();
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
}
