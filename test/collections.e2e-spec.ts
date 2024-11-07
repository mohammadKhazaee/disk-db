import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { fileEraser } from './helpers/file-eraser';
import {
  createCollectionTest,
  deleteCollectionTest,
} from './helpers/test-methods';

describe('CollectionsController (e2e)', () => {
  const dummyName: string = 'test___collection';

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
  });

  afterEach(async () => {
    // Deletes all of the test collection files to reset test state
    await fileEraser();
  });

  describe.skip('POST /collection route', () => {
    it('should create a collection for a valid name', () => {
      const actual = createCollectionTest(app, dummyName);

      return actual.expect(201);
    });

    it('should not create duplicate collection', async () => {
      const actual = createCollectionTest(app, dummyName);

      await createCollectionTest(app, dummyName);

      return actual.expect(403);
    });

    it('should response 422 statusCode for wrong request body', async () => {
      const wrongBody = { wrong: dummyName };

      const actual = request(app.getHttpServer())
        .post('/collections')
        .send(wrongBody);

      return actual.expect(422);
    });
  });

  describe.skip('Delete /collection route', () => {
    it('should delete a existing collection', async () => {
      await createCollectionTest(app, dummyName);

      const actual = deleteCollectionTest(app, dummyName);

      return actual.expect(200);
    });

    it('should respone 404 for non existing collection name', async () => {
      const actual = deleteCollectionTest(app, dummyName);

      return actual.expect(404);
    });

    it('should response 422 statusCode for invalid collection name', async () => {
      const actual = deleteCollectionTest(app, 'n');

      return actual.expect(422);
    });
  });
});
