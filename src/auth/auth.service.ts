import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SignupDto, GuestLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    await this.userRepo.save(user);
    
    return this.generateToken(user);
  }

  async login(dto: SignupDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  async guestLogin(dto: GuestLoginDto) {
    let user = await this.userRepo.findOne({ where: { deviceId: dto.deviceId } });
    
    if (!user) {
      user = this.userRepo.create({
        deviceId: dto.deviceId,
        isGuest: true,
      });
      await this.userRepo.save(user);
    }

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, isGuest: user.isGuest };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}