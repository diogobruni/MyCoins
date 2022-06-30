import { TokensRepository } from "../repositories/tokens-repository"

interface SearchTokensUseCaseRequest {
  query: string
}

export class SearchTokensUseCase {
  constructor(
    private tokensRepository: TokensRepository,
  ) { }

  async execute(request: SearchTokensUseCaseRequest) {
    const { query } = request

    if (!query) {
      throw new Error('Query is required')
    }

    return await this.tokensRepository.searchQuery({ query })
  }
}