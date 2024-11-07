import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { fileEraser } from './helpers/file-eraser';
import {
  createCollectionTest,
  createRecordTest,
  deleteRecordTest,
  updateRecordTest,
} from './helpers/test-methods';

describe('RecordsController (e2e)', () => {
  const dummyCollection = 'test__collection';

  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );

    await app.init();

    // base for tests
    await createCollectionTest(app, dummyCollection);
  });

  afterEach(async () => {
    // Deletes all of the test collection files to reset test state
    await fileEraser();
  });

  describe('GET /collection/:name/records route', () => {
    it('should retrieve right data', async () => {
      const dummyRecord = { name: 'john', age: 23 };
      const dummyRecord2 = { job: 'programmer', age: 23 };

      await createRecordTest(app, dummyCollection, dummyRecord);
      await createRecordTest(app, dummyCollection, dummyRecord2);

      const { body: actualBody } = (await request(app.getHttpServer())
        .get(`/collections/${dummyCollection}/records`)
        .expect(200)) as unknown as { body: object[] };

      expect(actualBody).toHaveLength(2);

      expect(actualBody).toEqual(
        expect.arrayContaining([
          expect.objectContaining(dummyRecord),
          expect.objectContaining(dummyRecord2),
        ]),
      );
    });

    it('should response 404 for wrong collection name', async () => {
      const wrongName = 'heh!';

      const actual = request(app.getHttpServer()).get(
        `/collections/${wrongName}/records`,
      );

      return actual.expect(404);
    });

    it('should retreive data according to skip and limit', async () => {
      const dummyRecord1 = { name: 'john', age: 23 };
      const dummyRecord2 = { job: 'programmer', age: 11 };
      const dummyRecord3 = { job: 'writer', age: 42 };

      await createRecordTest(app, dummyCollection, dummyRecord1);
      await createRecordTest(app, dummyCollection, dummyRecord2);
      await createRecordTest(app, dummyCollection, dummyRecord3);

      const { body: actualBody } = (await request(app.getHttpServer())
        .get(`/collections/${dummyCollection}/records?skip=1&limit=1`)
        .expect(200)) as unknown as { body: object[] };

      expect(actualBody).toHaveLength(1);

      expect(actualBody).toEqual(
        expect.arrayContaining([expect.objectContaining(dummyRecord2)]),
      );
    });
  });

  describe('GET /collection/:name/records/:id route', () => {
    const dummyRecord = { name: 'john', age: 23 };
    const dummyRecord2 = { job: 'programmer', age: 23 };

    it('should retrieve right data', async () => {
      const { body } = (await createRecordTest(
        app,
        dummyCollection,
        dummyRecord,
      )) as unknown as { body: { id: string } };

      await createRecordTest(app, dummyCollection, dummyRecord2);

      const { body: actualBody } = (await request(app.getHttpServer())
        .get(`/collections/${dummyCollection}/records/` + body.id)
        .expect(200)) as unknown as { body: object };

      expect(actualBody).toEqual(expect.objectContaining(dummyRecord));
    });

    it('should response 404 for wrong collection name', async () => {
      const wrongName = 'heh!';

      const { body } = (await createRecordTest(
        app,
        dummyCollection,
        dummyRecord,
      )) as unknown as { body: { id: string } };

      const actual = request(app.getHttpServer()).get(
        `/collections/${wrongName}/records/${body.id}`,
      );

      return actual.expect(404);
    });

    it('should response 422 for non-uuid params', async () => {
      const nonUUID = 1;

      return request(app.getHttpServer())
        .get(`/collections/${dummyCollection}/records/${nonUUID}`)
        .expect(422);
    });
  });

  describe('POST /collection/:name/records route', () => {
    const dummyRecord = { name: 'john', age: 23 };
    const dummyRecord2 = { job: 'programmer', age: 23 };

    it('should create 2 records', async () => {
      await createRecordTest(app, dummyCollection, dummyRecord).expect(201);
      await createRecordTest(app, dummyCollection, dummyRecord2).expect(201);

      const { body: actualBody } = (await request(app.getHttpServer())
        .get(`/collections/${dummyCollection}/records`)
        .expect(200)) as unknown as { body: object[] };

      expect(actualBody).toHaveLength(2);

      expect(actualBody).toEqual(
        expect.arrayContaining([
          expect.objectContaining(dummyRecord),
          expect.objectContaining(dummyRecord2),
        ]),
      );
    });

    it('should response 404 for wrong collection name', async () => {
      const wrongName = 'heh!';

      return createRecordTest(app, wrongName, dummyRecord).expect(404);
    });

    it('should response 422 for invalid body', async () => {
      return createRecordTest(app, dummyCollection, {}).expect(422);
    });
  });

  describe('PUT /collection/:name/records/:id route', () => {
    const dummyRecord = { name: 'john', age: 23 };
    const dummyRecord2 = { job: 'programmer', city: 'tehran' };

    it('should update old record to new record', async () => {
      const {
        body: { id: firstId },
      } = (await createRecordTest(
        app,
        dummyCollection,
        dummyRecord,
      )) as unknown as { body: { id: string } };

      await updateRecordTest(
        app,
        dummyCollection,
        firstId,
        dummyRecord2,
      ).expect(200);

      const { body: actualBody } = (await request(app.getHttpServer())
        .get(`/collections/${dummyCollection}/records/` + firstId)
        .expect(200)) as unknown as { body: object };

      expect(actualBody).toEqual(expect.objectContaining(dummyRecord2));
    });

    it('should response 404 for wrong collection name', async () => {
      const wrongName = 'heh!';

      const {
        body: { id: firstId },
      } = (await createRecordTest(
        app,
        dummyCollection,
        dummyRecord,
      )) as unknown as { body: { id: string } };

      return updateRecordTest(app, wrongName, firstId, dummyRecord).expect(404);
    });

    it('should response 422 for invalid body', async () => {
      const {
        body: { id: firstId },
      } = (await createRecordTest(
        app,
        dummyCollection,
        dummyRecord,
      )) as unknown as { body: { id: string } };

      return updateRecordTest(app, dummyCollection, firstId, {}).expect(422);
    });
  });

  describe('DELETE /collection/:name/records/:id route', () => {
    const dummyRecord = { name: 'john', age: 23 };
    const dummyRecord2 = { job: 'programmer', city: 'tehran' };

    it('should delete a record', async () => {
      const {
        body: { id: firstId },
      } = (await createRecordTest(
        app,
        dummyCollection,
        dummyRecord,
      )) as unknown as { body: { id: string } };

      await createRecordTest(app, dummyCollection, dummyRecord2);

      const { body: actualBody } = (await request(app.getHttpServer())
        .delete(`/collections/${dummyCollection}/records/` + firstId)
        .expect(200)) as unknown as { body: { record: object } };

      expect(actualBody.record).toEqual(expect.objectContaining(dummyRecord));
    });

    it('should response 404 for wrong collection name', async () => {
      const wrongName = 'heh!';

      const {
        body: { id: firstId },
      } = (await createRecordTest(
        app,
        dummyCollection,
        dummyRecord,
      )) as unknown as { body: { id: string } };

      return deleteRecordTest(app, wrongName, firstId).expect(404);
    });

    it('should response 404 for non existant record', async () => {
      const {
        body: { id: firstId },
      } = (await createRecordTest(
        app,
        dummyCollection,
        dummyRecord,
      )) as unknown as { body: { id: string } };

      await deleteRecordTest(app, dummyCollection, firstId);

      return deleteRecordTest(app, dummyCollection, firstId).expect(404);
    });

    it('should response 422 for non-uuid params', async () => {
      return deleteRecordTest(app, dummyCollection, '1').expect(422);
    });
  });
});
