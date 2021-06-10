import { memo, useState } from 'react'
import dynamic from 'next/dynamic'
import lodash from 'lodash'

import { AddProductToWishlistProps } from './AddProductToWishlist'

const AddProductToWishlist = dynamic<AddProductToWishlistProps>(() => {
  return import('./AddProductToWishlist').then(mod => mod.AddProductToWishlist)
}, {
  loading: () => <span>Carregando...</span>
})

interface ProductItemProps {
  product: {
    id: number;
   name: string;
   price: number;
   priceFormatted: string;
  }
  onAddToWishlist: (id: number) => void;
}

function ProductItemComponent ({ product, onAddToWishlist }: ProductItemProps) {
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)

  return (
    <div>
      {product.name} - <strong>{product.priceFormatted}</strong>
      <button 
        onClick={() => setIsAddingToWishlist(true)}
      >
        Adicionar aos favoritos
      </button>
      
      { isAddingToWishlist && (
        <AddProductToWishlist 
          onAddToWishlist={() => onAddToWishlist(product.id)}
          onRequestClose={() => setIsAddingToWishlist(false)}
        />
      )}
    </div>
  )
}

// Utilizando o lodash
export const ProductItem = memo(ProductItemComponent, (prevProps, nextProps) => {
 return lodash.isEqual(prevProps.product, nextProps.product)
})