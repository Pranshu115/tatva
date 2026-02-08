import express from 'express';

const router = express.Router();

router.post('/rank', async (req, res) => {
  const { items } = req.body;
  
  const itemVendors = {};
  items.forEach(item => {
    itemVendors[item.id] = [
      { id: `v1-${item.id}`, name: 'BuildMart Supply', price: 45, leadTime: 3, rank: 1 },
      { id: `v2-${item.id}`, name: 'ProConstruct Ltd', price: 48, leadTime: 2, rank: 2 },
      { id: `v3-${item.id}`, name: 'MegaSupply Co', price: 52, leadTime: 5, rank: 3 }
    ];
  });

  res.json({ itemVendors });
});

export { router as vendorRouter };
