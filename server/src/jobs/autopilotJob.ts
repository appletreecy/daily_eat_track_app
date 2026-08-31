import cron from 'node-cron';
import { autopilotService } from '../services/autopilotService';

export const startAutopilotJob = () => {
    cron.schedule(
        '5 0 * * *',
        async () => {
            try {
                await autopilotService.seedYesterdayIfEmpty();
                console.log('Autopilot job completed for yesterday');
            } catch (error) {
                console.error('Error in autopilot job:', error);
            }
        },
        {
            timezone: 'Australia/Sydney',
        }
    );
};
