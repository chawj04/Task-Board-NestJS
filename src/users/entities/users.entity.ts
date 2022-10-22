import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email']) // 이메일 중복 방지
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userIndex' })
  userIndex: number;

  @ApiProperty({
    example: 'testName1',
    description: 'username',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'username', length: 45 })
  username: string;

  @ApiProperty({
    example: 'testEmail@test.com',
    description: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Column('varchar', { name: 'email', length: 45 })
  email: string;

  @ApiProperty({
    example: 'asd1234',
    description: 'password',
    required: true,
  })
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
  //   message: 'Using a strong password',
  // })
  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date | null; //초기 null -> 삭제시 입력
}
