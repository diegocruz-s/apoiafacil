export interface IHttpRequest<T> {
  body?: T;
  params?: T;
};

export interface IHttpResponse<T> {
  body: T;
  statusCode: number;
};