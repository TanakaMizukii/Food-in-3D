import { createContext } from 'react';
import type { GroupedProduct } from '@/components/Menu/CompactMenuItem';
import type { ProductModel } from '@/data/types';

export type SelectedProductInfo = {
    groupedProduct: GroupedProduct;
    selectedVariant: ProductModel;
};

type SelectedProductContextType = {
    setSelectedProduct: (info: SelectedProductInfo) => void;
};

export const SelectedProductContext = createContext<SelectedProductContextType>({
    setSelectedProduct: () => {},
});
