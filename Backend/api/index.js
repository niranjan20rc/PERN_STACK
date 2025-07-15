import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { removeBackground } from '@imgly/background-removal-node';

const app = express();
app.use(cors());

// Use /tmp directory for file uploads in Vercel
const upload = multer({ dest: '/tmp' });

app.post('/api/remove-bg', upload.single('file'), async (req, res) => {
  try {
    const { path: imgPath } = req.file;
    const blob = await removeBackground(imgPath);
    const buf = Buffer.from(await blob.arrayBuffer());

    res.type('png').send(buf);
  } catch (err) {
    console.error('BG removal error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    // Clean up the temp file
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
  }
});

export default app;
