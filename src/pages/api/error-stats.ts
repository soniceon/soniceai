import { NextApiRequest, NextApiResponse } from 'next';
import errorTracker from '@/utils/errorTracking';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const stats = errorTracker.getErrorStats();
    const duplicateIssues = errorTracker.checkDuplicateIssues();
    const error404Trends = errorTracker.check404Trends();
    
    const response = {
      timestamp: new Date().toISOString(),
      stats,
      duplicateIssues,
      error404Trends,
      summary: {
        totalErrors: stats.total,
        hasDuplicateIssues: duplicateIssues.hasIssues,
        duplicateCount: duplicateIssues.count,
        error404Trend: error404Trends.trend,
        recent404Count: error404Trends.last24h
      }
    };
    
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting error stats:', error);
    res.status(500).json({ 
      error: 'Failed to get error statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 