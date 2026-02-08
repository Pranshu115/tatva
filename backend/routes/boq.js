import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/normalize', upload.single('file'), async (req, res) => {
  // Simulate AI normalization
  const mockItems = [
    { id: 1, rawName: 'Steel Rod 12mm', normalizedName: 'Steel Reinforcement Bar 12mm', quantity: 100, confidence: 0.95 },
    { id: 2, rawName: 'Cement OPC 53', normalizedName: 'Ordinary Portland Cement Grade 53', quantity: 50, confidence: 0.92 },
    { id: 3, rawName: 'Sand Fine', normalizedName: 'Fine Aggregate Sand', quantity: 200, confidence: 0.88 }
  ];

  setTimeout(() => {
    res.json({ items: mockItems });
  }, 1500);
});

export { router as boqRouter };
