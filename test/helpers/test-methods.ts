import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createCollectionTest = (app: INestApplication, name: string) => {
  return request(app.getHttpServer())
    .post('/collections')
    .send({ collectionName: name });
};

export const deleteCollectionTest = (app: INestApplication, name: string) => {
  return request(app.getHttpServer()).delete('/collections/' + name);
};

export const createRecordTest = (
  app: INestApplication,
  collectionName: string,
  data: object,
) => {
  return request(app.getHttpServer())
    .post(`/collections/${collectionName}/records`)
    .send({ data });
};

export const updateRecordTest = (
  app: INestApplication,
  collectionName: string,
  id: string,
  data: object,
) => {
  return request(app.getHttpServer())
    .put(`/collections/${collectionName}/records/${id}`)
    .send({ data });
};

export const deleteRecordTest = (
  app: INestApplication,
  collectionName: string,
  id: string,
) => {
  return request(app.getHttpServer()).delete(
    `/collections/${collectionName}/records/${id}`,
  );
};
