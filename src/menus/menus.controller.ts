import { Controller, Get, Query, Post } from '@nestjs/common';
import { MenusService } from './menus.service';
import { GetMenusDto } from './dto/get-menus.dto';
import { Menu } from './entities/menu.entity';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  // [기능 2] 메뉴 카테고리 필터 API
  @Get()
  findAll(@Query() query: GetMenusDto) {
    return this.menusService.findAll(query.category);
  }

  // [기능 1] 랜덤 추천 테스트용 API
  @Get('recommend')
  async recommend(): Promise<Menu> {
    return this.menusService.recommendMenu();
  }

  // 테스트 데이터 생성용
  @Post('seed')
  async seed() {
    return this.menusService.seedData();
  }
}