import { Request, Response, Router } from 'express';
import { prisma } from '../../server.js';

const router = Router();

interface CarInput {
  name?: string;
  year?: number | string;
  engine?: string;
  hp?: number | string;
  features?: string[];
}

// Get all cars
router.get('/', async (_req: Request, res: Response) => {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// Get a single car by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const carId = parseInt(id, 10);

  if (isNaN(carId)) {
    return res.status(400).json({ error: 'Invalid car ID' });
  }

  try {
    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    return res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    return res.status(500).json({ error: 'Failed to fetch car' });
  }
});

// Create a new car
router.post('/', async (req: Request<{}, {}, CarInput>, res: Response) => {
  const { name, year, engine, hp, features } = req.body;
  
  if (!name || year === undefined || !engine || hp === undefined) {
    return res.status(400).json({ 
      error: 'Name, year, engine, and hp are required' 
    });
  }

  try {
    const car = await prisma.car.create({
      data: {
        name,
        year: typeof year === 'string' ? parseInt(year, 10) : year,
        engine,
        hp: typeof hp === 'string' ? parseInt(hp, 10) : hp,
        features: Array.isArray(features) ? features : [],
      },
    });
    return res.status(201).json(car);
  } catch (error) {
    console.error('Error creating car:', error);
    return res.status(500).json({ error: 'Failed to create car' });
  }
});

// Update a car
router.put('/:id', async (req: Request<{ id: string }, {}, CarInput>, res: Response) => {
  const { id } = req.params;
  const { name, year, engine, hp, features } = req.body;
  const carId = parseInt(id, 10);

  if (isNaN(carId)) {
    return res.status(400).json({ error: 'Invalid car ID' });
  }

  try {
    const car = await prisma.car.update({
      where: { id: carId },
      data: {
        name,
        year: year !== undefined 
          ? (typeof year === 'string' ? parseInt(year, 10) : year)
          : undefined,
        engine,
        hp: hp !== undefined
          ? (typeof hp === 'string' ? parseInt(hp, 10) : hp)
          : undefined,
        features: features !== undefined && Array.isArray(features) 
          ? features 
          : undefined,
      },
    });
    return res.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    return res.status(500).json({ error: 'Failed to update car' });
  }
});

// Delete a car
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const carId = parseInt(id, 10);

  if (isNaN(carId)) {
    return res.status(400).json({ error: 'Invalid car ID' });
  }

  try {
    await prisma.car.delete({
      where: { id: carId },
    });
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting car:', error);
    return res.status(500).json({ error: 'Failed to delete car' });
  }
});

export default router;
