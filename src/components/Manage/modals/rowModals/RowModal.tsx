import React, { useContext } from 'react';
import ProductTypeRowModal from './ProductTypeRowModal';
import { CollectionName } from '@/lib/models/utilities';
import ProductRowModal from './ProductRowModal';
import BatchRowModal from './BatchRowModal';
import { ManageContextType } from '@/lib/localLib/manage';
import { ManageContext } from '@/pages/manager/manage';

export default function RowModal() {
  const { state } = useContext<ManageContextType>(ManageContext);

  switch (state.selectedTarget?.collectionName) {
    case CollectionName.ProductTypes:
      return <ProductTypeRowModal />;
    case CollectionName.Products:
      return <ProductRowModal />;
    case CollectionName.Batches:
      return <BatchRowModal />;
    default:
      return <div>RowModal</div>;
  }
}
