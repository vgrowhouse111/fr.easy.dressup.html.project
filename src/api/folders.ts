import { Request, Response, Router } from 'express';
import { prisma } from '../../server.js';

const router = Router();

interface FolderInput {
  name?: string;
  isPrivate?: boolean | string;
}

// Get all folders
router.get('/', async (_req: Request, res: Response) => {
  try {
    const folders = await prisma.folder.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// Create a new folder
router.post('/', async (req: Request<{}, {}, FolderInput>, res: Response) => {
  const { name, isPrivate } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        isPrivate: isPrivate === true || isPrivate === 'true',
        views: 0,
      },
    });
    return res.status(201).json(folder);
  } catch (error) {
    console.error('Error creating folder:', error);
    return res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Increment view count for a folder
router.post('/:id/view', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const folderId = parseInt(id, 10);

  if (isNaN(folderId)) {
    return res.status(400).json({ error: 'Invalid folder ID' });
  }

  try {
    const folder = await prisma.folder.update({
      where: { id: folderId },
      data: {
        views: { increment: 1 },
      },
    });
    return res.json(folder);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return res.status(500).json({ error: 'Failed to update view count' });
  }
});

export default router;
