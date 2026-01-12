import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 사내 SSO가 OAuth2 표준을 따른다고 가정하고 Google Strategy를 예시로 구현
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('OAUTH_CLIENT_ID'),
      clientSecret: configService.get('OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get('OAUTH_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      username: name.givenName + ' ' + name.familyName,
      avatarUrl: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}