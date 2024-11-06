import { ForbiddenException, Injectable } from '@nestjs/common';
import { CollectionRepository } from './collections.repository';
import { ValidCollectionName } from './types/colection-name.type';

@Injectable()
export class CollectionsService {
  constructor(private readonly collectionRepo: CollectionRepository) {}

  async createCollection(name: ValidCollectionName) {
    const nameStatus = await this.collectionRepo.verifyCollectionName(name);

    if (nameStatus._tag === 'Existed')
      throw new ForbiddenException('this collection already exists');

    return this.collectionRepo.createCollection(nameStatus);
  }

  async deleteCollection(name: ValidCollectionName) {
    const nameStatus = await this.verifyCollectionExists(name);

    return this.collectionRepo.deleteCollection(nameStatus);
  }

  async verifyCollectionExists(name: ValidCollectionName) {
    const result = await this.collectionRepo.verifyCollectionName(name);

    if (result._tag === 'NonExisted')
      throw new ForbiddenException("this collection doesn't exists");

    return result;
  }
}
