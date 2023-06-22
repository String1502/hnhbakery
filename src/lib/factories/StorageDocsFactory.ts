import {
  fetchBatchesForStoragePage,
  fetchProductTypesForStoragePage,
  fetchProductsForStoragePage,
} from '@/lib/firestore/firestoreLib';
import BaseObject from '@/lib/models/BaseObject';

export interface StorageDocsFetcher {
  fetch(): Promise<BaseObject[]>;
}

export class ProductTypeStorageDocsFetcher implements StorageDocsFetcher {
  async fetch(): Promise<BaseObject[]> {
    const docs = await fetchProductTypesForStoragePage();
    return docs;
  }
}

export class ProductStorageDocsFetcher implements StorageDocsFetcher {
  async fetch(): Promise<BaseObject[]> {
    const docs = await fetchProductsForStoragePage();
    return docs;
  }
}

export class BatchStorageDocsFetcher implements StorageDocsFetcher {
  async fetch(): Promise<BaseObject[]> {
    const docs = await fetchBatchesForStoragePage();
    return docs;
  }
}