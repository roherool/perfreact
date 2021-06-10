import { List, ListRowRenderer } from 'react-virtualized'

import { ProductItem } from "./ProductItem"

interface SearchResultProps {
  totalPrice: number;
  results: Array<{
    id: number;
    name: string;
    price: number;
    priceFormatted: string;
  }>
  onAddToWishlist: (id: number) => void;
}

export function SearchResult({ totalPrice, results, onAddToWishlist }: SearchResultProps) {
  // Virtualização
  const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
    return (
      <div key={key} style={style}>
        <ProductItem 
          product={results[index]} 
          onAddToWishlist={onAddToWishlist} 
        />
      </div>
    )
  }

  return (
    <div>
      <h2>{totalPrice}</h2>

      {/* Virtualização */}
      <List 
        height={600}
        rowHeight={30}
        width={600}
        overscanRowCount={5}
        rowCount={results.length}
        rowRenderer={rowRenderer}
      />
    </div>
  )
}