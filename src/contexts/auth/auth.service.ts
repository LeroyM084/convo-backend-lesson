import { Injectable, Inject, ExecutionContext } from '@nestjs/common';
import { AUTH_REPOSITORY, IAuthRepository } from './auth.repository.interface';
import { UserCredentialsEntity } from './entities/user_credentials.entities';
import { LoginDTO, RegisterDTO } from './types/auth.dto';
import { PASSWORD_HASHER} from './interface/password-hasher.interface';
import { PasswordHasherService } from './password-hasher.service';
import * as jwt from 'jsonwebtoken';
import { JWT_SERVICE, JWTServiceInterface } from './interface/jwt.interface';
import { JWTService } from './jwt.service';
import { DomainError } from 'src/core/errors/domain-error';
@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasherService,
    @Inject(JWT_SERVICE) private readonly jwtService: JWTService,
  ) {}

  async register (dto : RegisterDTO): Promise<boolean | string> {
    const emailExists =  await this.authRepository.checkEmailExists(dto.email);
    if (emailExists) {
      return "Email already in use";
    }
    const hashedPassword = await this.passwordHasher.hash(dto.password);
    const userCredentials = new UserCredentialsEntity();
    userCredentials.email = dto.email;
    userCredentials.passwordHash = hashedPassword;
    await this.authRepository.createCredentials(userCredentials);

    const userProfile = await this.authRepository.createProfile(dto.username, userCredentials.id);
    console.log(userProfile);
    return true;
  }

  async login (dto: LoginDTO): Promise<object | null> {
    const userCredentials = await this.authRepository.findCredentialsByEmail(dto.email);
    if (!userCredentials) {
      return null
    }

    if (!await this.passwordHasher.compare(dto.password, userCredentials.passwordHash)) {
      return null
    }

    const acces_token = await this.jwtService.generateToken({ userCredentials});
    const refresh_token = await this.jwtService.generateToken({ userCredentials }, '7d');

    return { acces_token, refresh_token };
  }

 
}


