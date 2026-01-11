import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { Menu } from './entities/menu.entity';
import { History } from './entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, History])],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService], // NotificationsModule에서 사용하기 위해 export
})
export class MenusModule {}