export interface IJob {
  key: string;
  options: object;
  handle: ({}: any) => Promise<void>;
};