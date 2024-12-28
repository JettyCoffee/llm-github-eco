// pages/api/data/[project]/[dataType].js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { project, dataType } = req.query;
  const filePath = path.join(process.cwd(), 'public', 'data', project, `${dataType}.json`);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Data not found' });
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error loading data for project: ${project}, dataType: ${dataType}`, error);
    res.status(500).json({ error: 'Failed to load data' });
  }
}
