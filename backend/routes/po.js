import express from 'express';

const router = express.Router();

router.post('/group', async (req, res) => {
  const { selectedVendors, substitutions } = req.body;
  
  const groups = [
    {
      vendorId: 'v1',
      vendorName: 'BuildMart Supply',
      total: 4500,
      items: [
        { name: 'Steel Reinforcement Bar 12mm', quantity: 100, price: 45 }
      ]
    },
    {
      vendorId: 'v2',
      vendorName: 'ProConstruct Ltd',
      total: 14000,
      items: [
        { name: 'Ordinary Portland Cement Grade 53', quantity: 50, price: 280 }
      ]
    }
  ];

  res.json({ groups });
});

router.post('/create', async (req, res) => {
  const { poGroups } = req.body;
  
  // Simulate PO creation
  setTimeout(() => {
    res.json({ success: true, poIds: poGroups.map((_, i) => `PO-${Date.now()}-${i}`) });
  }, 1000);
});

export { router as poRouter };
