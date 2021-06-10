![](/public/logo_react.svg)

## MELHORANDO A PERFORMANCE DO REACT

- Este projeto visa mostrar como melhorar a performance do **REACT.JS** na reinderização dos componentes, para isso é preciso entender como **REACT.JS** trabalha por baixo dos panos, utilizando o **REACT.DOM**.

## PADRÃO DE RENDERIZAÇÃO DO REACT

1. Criar uma nova versão do componente
2. Comparar a nova versão com a anterior
3. Se houver alterações, atualiza somente o que alterou no componente

## FUNÇÃO MEMO

- O **MEMO** vai evitar que a primeira instrução aconteça, caso o nenhuma propriedade do componente tenha sido alterada

- **import { memo } from 'react**

- A função **MEMO** recebe um segundo parâmetro, que faz uma verificação que chamamos de **shallow compare** dentro do **REACT** que executa uma igualdade referencial dentro da **DOM**.

- No caso a função **MEMO** sempre vai receber as **propriedades anteriores** e as **próximas propriedades**, ou seja, as propriedades que tinha antes da renderização e e as propriedades que vieram depois da nova renderização.

### CASOS QUE DEVEMOS UTILIZAR O MEMO

1. **Pure Functional Components** ou conhecidas como funções puras na programação funcional, dados aos mesmos parâmetros, são aquelas que sempre retornam o mesmo resultado.

2. **Renders too often** Em componentes que renderizam muitas vezes, nesse caso deve ser observando com o **ReactDevTools**, se algum componente está renderizando demais e aplicar o **MEMO**, nesses componentes para que não renderizem.

3. **Re-renders with same props** Quando o componente reinderiza seguidamente, mesmo sendo em menor ritmo, mas com as mesmas **props**,  é o caso de usar a função **MEMO**.

4. **Medium to big size** O **REACT** ganha muito mais performance, quando utiliza o **MEMO**, quando componente passa de um tamanho médio para um tamanho grande. No caso componentes pequenos o **MEMO** não vai trazer grandes ganhos de performance.

**Exemplo de Função normal**
~~~JavaScript
export function ProductItem ({ product }: ProductItemProps) {
   return (
     <div>
       {product.name} - <strong>{product.price}</strong>
     </div>
   )
}
~~~

**Exemplo de Função usando MEMO**
~~~JavaScript
function ProductItemComponent ({ product }: ProductItemProps) {
   return (
     <div>
       {product.name} - <strong>{product.price}</strong>
     </div>
   )
}

export const ProductItem = memo(ProductItemComponent, (prevProps, nextProps) => {
  return Object.is(prevProps, nextProps)
})
~~~

## FUNÇÃO HOOK - USEMEMO

- A função **USEMEMO** tem uma única funcionalidade que é evitar que uma função execute um grande processamento ou um grande cálculo. Ele não vai permitir recalcular algo que não tenha necessidade. Ele serve para memorizar um valor de uma variável.

- O **USEMEMO** pode ser utilizado para comparar a **igualdade referencial**, que é quando a varíavel está usando o mesmo espaço na memória. Nesse caso, sempre que um componente qualquer for usar uma mesma variável, se o **useMemo** não estiver configurado, essa variável vair recriar um novo espaço na memória, sempre que algum desses componentes renderizado estiver usando a mesma variável. Esse **hook** serve para evitar cálculo desnecessários dentro da nossa aplicação. O **USEMEMO** tem um custo de processamento, por isso devemos ter cuidado de quando e como usá-lo.

### CASOS QUE DEVEMOS UTILIZAR O USEMEMO
1. **Cálculos pesados** Somente quando temos cálculos que vai exigir recurso da máquina, se for trabalhar cálculos pequenos, não vale a pena utilizar o **USEMEMO**, as vezes o simples fato de ter esse HOOK por volta da função, já vai tornar a função mais pesada do que o próprio cálculo em si.

2. **Igualdade Referencial** basicamente quando a gente passa uma informação a um componente filho. Isso vai evitar que o algaritmo do REACT recrie variável desnecessariamente.

**Exemplo de Função usando useMemo**
~~~JavaScript
export function SearchResult({ results }: SearchResultProps) {
  const totalPrice = useMemo (() => {
    return results.reduce((total, product) => {
      return total + product.price
    }, 0)
  }, [results])

  return (
    <div>
      <h2>{totalPrice}</h2>

      {results.map(product => {
        return (
          <ProductItem product={product} />
        )
      })}
    </div>
  )
}
~~~

## FUNÇÃO HOOK - USECALLBACK
A função **USECALLBACK** é muito parecido com a **USEMEMO** mas ele é utilizado apenas em uma situação diferente da anterior. Ele serve para memorizar uma função e não um valor.

Um exemplo prático disso, é que toda a vez que um componente **Home** for renderizado, ou seja, ele tiver o seu **estado** alterado, sua **propriedade** alterada ou **algum componente** por volta dele renderizar, todas as funções que estiverem dentro do **useCallback** vão ser recriadas. Vão ocupar um novo espaço na memória.

### CASOS QUE DEVEMOS UTILIZAR O USECALLBACK

1. Quando uma função expressa um Context que vai ser usada em várias páginas

**Exemplo de Função usando useCallback**
~~~JavaScript
import { FormEvent, useCallback, useState } from 'react'
import { SearchResult } from '../components/SearchResult'

export default function Home() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  async function handleSearch(event: FormEvent) {
    event.preventDefault()

    if (!search.trim()) {
      return
    }

    const response = await fetch(`http://localhost:4000/products?q=${search}`)
    const data = await response.json()

    setResults(data)
  }

  const addToWishlist = useCallback(async (id: number) => {
    console.log(id)
  }, [])

  return (
    <>
    <div>
      <h1>Search</h1>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <SearchResult 
        results={results} 
        onAddToWishlist={addToWishlist}
      />
    </div>
    </>
  )
}
~~~

## FORMATAÇÃO DE DADOS NO REACT

O exemplo que abordo aqui, são para casos em que o processamento ou cálculo, são mais simples, não exigindo tanto do sistema, ainda assim é possívell melhorar a performance do **REACT**, formatando os dados para o processamento.

Porém precisamos tomar alguns cuidados, pois é muito comum cometerem o erro de executar cálculos ou formatações no momento da renderização, ou seja dentro do escopo do **RETURN**. Essa não é a melhor prática, pois nessa hora é o pior momento para fazermos algum tipo de cálculo ou de formatação. Somente usar dentro da renderização, se for algo extremamente simples e leve.

A melhor prática de trazer um cálculo ou formatação, é quando da chamada ou da criação da função.

**Exemplo de Formatação de Código dentro da função**
~~~JavaScript
async function handleSearch(event: FormEvent) {
    event.preventDefault()
   
    const response = await fetch(`http://localhost:4000/products?q=${search}`)
    const data = await response.json()

    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    
    const products = data.map(product => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        priceFormatted: formatter.format(product.price)
      }
    })

    const totalPrice = data.reduce((total, product) => {
      return total + product.price
    }, 0)

    setResults({ totalPrice, data: products })
  }
  ~~~

  ### DIVIDINDO O CÓDIGO (CODE-SPLITTING)

  #### Empacotamento (Bundling)

  A maioria das aplicações **REACT** serão empacotadas usando ferramentas como **Webpack**, **Rollup** ou **Browserify**. Empacotamento **(Bundling)** é o processo onde vários arquivos importados, são unidos em um único arquivo: um **pacote** ou **(bundle)** como é conhecido. Este pacote pode ser incluído em uma página web para carregar uma aplicação toda de uma vez. Isso quase sempre acarreta perda de performance na aplicação. Devido a isso, sempre é uma boa prática aplicar o conceito de **CODE-SPLITTING** que é a **DIVISÃO DE CÓDIGO**, tornando a sua aplicação mais performática.

  ~~~JavaScript
  import dynamic from 'next/dynamic'
  ~~~

  Podemos utilizar nesses casos o **DYNAMIC** do **NEXT** para nos auxiliar nessa tarefa, para criarmos códigos menores e aplicarmos assim o conceito de **CODE-SPLITTING**.

  #### Loading Lazy

### VIRTUALIZAÇÃO

**Install Packages:** 
yarn add react-virtualized 
yarn add @types/react-virtualized -D

Para o exemplo de como virtualizar os componentes do **REACT**, vamos utilizar uma biblioteca muito conhecida que é a **REACT VIRTUALIZED**

**Exemplo de Virtualização**
~~~javaScript
import { List, ListRowRenderer } from 'react-virtualized'

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
        height={300}
        rowHeight={30}
        width={900}
        overscanRowCount={5}
        rowCount={results.length}
        rowRenderer={rowRenderer}
      />
    </div>
  )
}
~~~

## BUNDLE ANALYZER

**Install Packages:** 
yarn add @next/bundle-analyzer
yarn add lodash
yarn add @types/lodash -D
~~~javaScript
import lodash from 'lodash'
~~~

**Configura o arquivo> next.config.js**
~~~javaScript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({})
~~~

**Rodar o comando no terminal**
~~~javaScript
ANALYZE=true yarn build
~~~