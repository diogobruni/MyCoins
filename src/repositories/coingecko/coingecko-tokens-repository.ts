import axios, { AxiosInstance } from 'axios'
import { TokensGetByIdData, TokensQueryData, TokensRepository, Token } from '../tokens-repository'

export class CoingeckoTokensRepository implements TokensRepository {
  async searchTrending() {
    const response = await axios.get('https://api.coingecko.com/api/v3/search/trending')

    const tokenList = response.data?.coins.map((coins: any) => {
      const token = coins.item
      return {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        image: {
          thumb: token.thumb,
          small: token.small,
          large: token.large,
        }
      } as Token
    })

    return tokenList || []
    // return response.data?.coins || []
  }

  async searchQuery(data: TokensQueryData) {
    // const response = await axios.get(`https://api.coingecko.com/api/v3/coins/list?${data.query}`)
    const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${data.query}`)

    const tokenList = response.data?.coins.map((token: any) => {
      return {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        image: {
          thumb: token.thumb,
          small: token.small,
        }
      } as Token
    })

    return tokenList || []
  }

  async getById(data: TokensGetByIdData) {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${data.id}`)
    const rawToken = response.data as any

    const token = {
      id: rawToken.id,
      name: rawToken.name,
      symbol: rawToken.symbol,
      image: {
        thumb: rawToken.image?.thumb,
        small: rawToken.image?.small,
        large: rawToken.image?.large,
      },
      current_price: {
        usd: rawToken.market_data?.current_price?.usd
      },
      high_24h: {
        usd: rawToken.market_data?.high_24h?.usd
      },
      low_24h: {
        usd: rawToken.market_data?.low_24h?.usd
      },
      price_change_24h: {
        usd: rawToken.market_data?.price_change_24h_in_currency?.usd
      },
      price_change_percentage_24h: rawToken.market_data?.price_change_percentage_24h,
      price_change_percentage_7d: rawToken.market_data?.price_change_percentage_7d,
      price_change_percentage_14d: rawToken.market_data?.price_change_percentage_14d,
      price_change_percentage_30d: rawToken.market_data?.price_change_percentage_30d,
      price_change_percentage_60d: rawToken.market_data?.price_change_percentage_60d,
    } as Token

    return token
  }
}