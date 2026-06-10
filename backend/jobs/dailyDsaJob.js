import cron from 'node-cron';
import { createOrUpdateTodayDsa } from '../services/dsaService.js';

export const startDailyDsaJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      await createOrUpdateTodayDsa();
      console.log('Daily DSA updated successfully');
    } catch (error) {
      console.error('Daily DSA job failed:', error.message);
    }
  });

  console.log('Daily DSA cron job started');
};