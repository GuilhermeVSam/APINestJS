import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'email@email.com', description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  @IsNotEmpty()
  password: string;
}
