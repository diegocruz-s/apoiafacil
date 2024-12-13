export interface IQueueController {
  add (name: string, data: unknown): Promise<unknown>;
  process (): Promise<void>;
};
