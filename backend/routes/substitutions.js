import express from 'express';

const router = express.Router();

router.post('/suggest', async (req, res) => {
  const suggestions = [
    {
      id: 1,
      originalItem: 'Steel Reinforcement Bar 12mm',
      originalPrice: 45,
      originalLeadTime: 3,
      suggestedItem: 'Steel Reinforcement Bar 10mm (Higher Grade)',
      suggestedPrice: 38,
      suggestedLeadTime: 2
    },
    {
      id: 2,
      originalItem: 'Ordinary Portland Cement Grade 53',
      originalPrice: 280,
      originalLeadTime: 5,
      suggestedItem: 'Portland Pozzolana Cement',
      suggestedPrice: 245,
      suggestedLeadTime: 4
    }
  ];

  res.json({ suggestions });
});

export { router as substitutionRouter };
