import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { LoginUser } from './types'
import { UserRepository } from '@/infra/repositories/user.repository'

const PASSWORD_1234 =
  '$2b$10$Z0EGauNanl2jiCUBwcRhGuC6/QBC1Sl1.nqFINRn1Q.nDvuuZZF0K'

describe('AuthService', () => {
  let authService: AuthService
  const userRepository = {
    getByEmail: jest.fn(),
  }
  const jwtService = {
    sign: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
  })

  describe('validateUser', () => {
    it('should return user without password if password matches', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: PASSWORD_1234,
        name: 'Test User',
      }

      userRepository.getByEmail.mockResolvedValue(user)

      const result = await authService.validateUser('test@example.com', '1234')
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      })
    })

    it('should return null if user not found', async () => {
      userRepository.getByEmail.mockResolvedValue(null)

      const result = await authService.validateUser(
        'notfound@example.com',
        '1234',
      )

      expect(result).toBeNull()
    })

    it('should return null if password does not match', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'wrong',
      }

      userRepository.getByEmail.mockResolvedValue(user)

      const result = await authService.validateUser('test@example.com', '1234')
      expect(result).toBeNull()
    })
  })

  describe('sign', () => {
    it('should return access token', () => {
      const user: LoginUser = {
        id: '1',
        email: 'test@example.com',
      }

      jwtService.sign.mockReturnValue('mocked-jwt')

      const result = authService.sign(user)

      expect(result).toEqual({ accessToken: 'mocked-jwt' })
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      })
    })
  })
})
