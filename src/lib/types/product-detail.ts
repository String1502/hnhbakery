import { AssembledProduct } from '../contexts/productsContext';
import { BatchObjectWithDiscount, ProductVariant, UserObject } from '../models';

export type CommentUser = {
  id: string;
  name: string;
  image: string;
};

export type Comments = {
  ratingAverage: number;
  numReviews: number;
  items: {
    id: string;
    rating: number;
    comment: string;
    time: string;
    user: CommentUser;
  }[];
};

export type ProductDetailInfoProps = {
  comments: Comments;
  variant: ProductVariant | null;
  onVariantChange: (newVariant: ProductVariant) => void;
  batch: BatchObjectWithDiscount | null;
  batchOptions: BatchObjectWithDiscount[];
  onBatchChange: (newBatch: BatchObjectWithDiscount) => void;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  product: AssembledProduct;
  onAddToCart: () => void;
};

export type ProductCarouselProps = {
  images: string[];
};