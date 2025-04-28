import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

app.use(cors());

app.use(express.static('public'));
app.use('/model.h5', express.static(path.join(__dirname, 'src/lib/model.h5')));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

app.post('/api/predict', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const tempImagePath = path.join(__dirname, 'temp_image.jpg');
    fs.writeFileSync(tempImagePath, req.file.buffer);

    const pythonPath = path.join(__dirname, 'venv-tf', 'Scripts', 'python.exe');
    
    console.log(`Running prediction with Python: ${pythonPath}`);
    console.log(`Image path: ${tempImagePath}`);
    
    const pythonProcess = spawn(pythonPath, ['predict.py', tempImagePath]);
    
    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
      console.error('Python stderr:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      try {
        fs.unlinkSync(tempImagePath);
      } catch (err) {
        console.error('Error deleting temp file:', err);
      }

      if (code !== 0) {
        console.error('Python process exited with code', code);
        console.error('Python error:', error);
        return res.status(500).json({ error: 'Error processing image' });
      }

      try {
        result = result.trim();
        console.log('Raw result:', result);
        
        const prediction = JSON.parse(result);
        return res.json(prediction);
      } catch (parseError) {
        console.error('Error parsing prediction result:', parseError);
        console.error('Raw result that failed to parse:', result);
        
        try {
          const jsonStartIndex = result.indexOf('{');
          const jsonEndIndex = result.lastIndexOf('}') + 1;
          
          if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
            const extractedJson = result.substring(jsonStartIndex, jsonEndIndex);
            console.log('Extracted JSON:', extractedJson);
            const prediction = JSON.parse(extractedJson);
            return res.json(prediction);
          }
        } catch (e) {
          console.error('Failed to extract valid JSON:', e);
        }
        
        return res.json({
          prediction: "UNKNOWN",
          confidence: 50,
          note: "Could not process result, using default values"
        });
      }
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return res.status(500).json({ error: 'Error processing image' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Using model from: ${path.join(__dirname, 'src/lib/model.h5')}`);
}); 