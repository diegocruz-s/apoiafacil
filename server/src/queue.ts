import 'dotenv/config';
import { queueController } from './infra/lib/Queue';

queueController.process();

console.log('Queue processor started.');