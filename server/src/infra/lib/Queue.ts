import QueueBull, { Queue } from 'bull';
import { jobs } from '../../jobs/index';
import { ConfigRedis } from '../config/redis';
import { IJob } from '../../jobs/interfaces/IJob';
import { IQueueController } from './protocols';

interface IQueue {
  bull: Queue;
  name: string;
  job: IJob;
  options: object; 
};

class QueueController implements IQueueController {
  private queues: IQueue[] = [];
  
  constructor () {    
    this.createQueues();
  };

  createQueues () {    
    jobs.map(job => {
      this.queues.push({
        name: job.key,
        options: job.options,
        job: job,
        bull: new QueueBull(job.key, { redis: ConfigRedis }),
      });
    });    
  };

  async add (name: string, data: unknown) {    
    const queue = this.queues.find(queue => queue.name === name);
    
    return queue?.bull.add(data, queue.options);
  };

  async process () {
    return this.queues.forEach(queue => {      
      queue.bull.process(async (job) => {
        const datas = job.data;
        console.log('jobDatas: ', datas);
        await queue.job.handle(datas);
      });

      queue.bull.on('failed', async (job) => { 
        console.log('Job Failed', queue.name, job.name);
      });

      queue.bull.on('error', (error) => {
        console.error('Erro na fila:', error);
      });
    }); 
  };

  async close () {
    for (const queue of this.queues) {
      await queue.bull.close();
    };
  };
};

const queueController = new QueueController();

export {
  queueController,
};