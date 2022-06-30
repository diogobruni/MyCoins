export interface TokensQueryData {
  query: string
}

export interface TokensGetByIdData {
  id: string
}

export interface Token {
  id: string
  name: string
  image: {
    thumb: string
    small?: string
    large?: string
  }
  symbol: string
  current_price?: {
    usd: number
  }
  high_24h?: {
    usd: number
  }
  low_24h?: {
    usd: number
  }
  price_change_24h?: {
    usd: number
  }
  price_change_percentage_24h?: number
  price_change_percentage_7d?: number
  price_change_percentage_14d?: number
  price_change_percentage_30d?: number
  price_change_percentage_60d?: number
}

export interface TokensRepository {
  searchTrending: () => Promise<Token[]>
  searchQuery: (data: TokensQueryData) => Promise<Token[]>
  getById: (data: TokensGetByIdData) => Promise<Token>
}