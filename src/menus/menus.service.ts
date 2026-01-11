import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { History } from './entities/history.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  // [기능 2] 카테고리 필터링 조회
  async findAll(category?: string): Promise<Menu[]> {
    if (category) {
      return this.menusRepository.find({ where: { category } });
    }
    return this.menusRepository.find();
  }

  // [기능 1] 랜덤 메뉴 추천 알고리즘
  async recommendMenu(): Promise<Menu> {
    // 1. 최근 5일간 먹은 기록 조회 (점심 기준)
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 5);

    const histories = await this.historyRepository.find({
      where: { eatenAt:  /* TypeORM 연산자 활용 가능, 여기선 단순화 */ undefined }, 
      order: { eatenAt: 'DESC' },
      take: 20 // 넉넉하게 최근 기록 가져옴
    });

    const recentMenuIds = histories
      .filter(h => h.eatenAt > recentDate)
      .map(h => h.menuId);

    // 2. 최근 먹은 메뉴 제외하고 전체 메뉴 로드
    let candidates: Menu[];
    
    if (recentMenuIds.length > 0) {
      candidates = await this.menusRepository.find({
        where: { id: Not(In(recentMenuIds)) }
      });
    } else {
      candidates = await this.menusRepository.find();
    }

    if (candidates.length === 0) {
      throw new NotFoundException('추천할 수 있는 메뉴 후보가 없습니다.');
    }

    // 3. 선호도(preference) 가중치 반영 랜덤 선택
    return this.weightedRandomSelection(candidates);
  }

  private weightedRandomSelection(items: Menu[]): Menu {
    const totalWeight = items.reduce((sum, item) => sum + item.preference, 0);
    let randomNum = Math.random() * totalWeight;

    for (const item of items) {
      randomNum -= item.preference;
      if (randomNum <= 0) {
        return item;
      }
    }
    return items[items.length - 1]; // Fallback
  }
  
  // 추천 메뉴 확정 시 기록 저장 (외부 호출용)
  async recordHistory(menu: Menu) {
    const history = this.historyRepository.create({
        menu: menu,
        menuId: menu.id
    });
    await this.historyRepository.save(history);
  }

  // 테스트 데이터 시딩
  async seedData() {
    const menus = [
      { name: '김치찌개', category: '한식', preference: 8 },
      { name: '된장찌개', category: '한식', preference: 7 },
      { name: '짜장면', category: '중식', preference: 9 },
      { name: '짬뽕', category: '중식', preference: 8 },
      { name: '초밥', category: '일식', preference: 10 },
      { name: '돈까스', category: '일식', preference: 9 },
      { name: '파스타', category: '양식', preference: 6 },
    ];
    return this.menusRepository.save(menus);
  }
}