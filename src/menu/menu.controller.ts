import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MenuService } from './menu.service';

@Controller('menus')
@UseGuards(AuthGuard('jwt'))
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.menuService.create(req.user.userId, body);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() body) {
    return this.menuService.update(+id, req.user.userId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}