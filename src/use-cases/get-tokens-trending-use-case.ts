import { TokensRepository } from "../repositories/tokens-repository"

export class GetTokensTrendingUseCase {
  constructor(
    private tokensRepository: TokensRepository,
  ) { }

  async execute() {
    return await this.tokensRepository.searchTrending()
  }
}