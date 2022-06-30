import { TokensRepository } from "../repositories/tokens-repository"

interface GetTokenUseCaseRequest {
  id: string
}

export class GetTokenUseCase {
  constructor(
    private tokensRepository: TokensRepository,
  ) { }

  async execute(request: GetTokenUseCaseRequest) {
    const { id } = request

    if (!id) {
      throw new Error('Id is required')
    }

    return await this.tokensRepository.getById({ id })
  }
}