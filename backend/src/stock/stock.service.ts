import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, Between } from 'typeorm';
import { Stock } from './stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async getDashboardStats() {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);

    const [normal, warning, danger] = await Promise.all([
      this.stockRepository.count({ where: { expiryDate: MoreThan(threeMonthsLater) } }),
      this.stockRepository.count({ where: { expiryDate: Between(now, threeMonthsLater) } }),
      this.stockRepository.count({ where: { expiryDate: LessThan(now) } }),
    ]);

    // Aggregation for Bar Chart
    const monthlyData = await this.stockRepository
      .createQueryBuilder('stock')
      .select("TO_CHAR(stock.expiryDate, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .limit(6)
      .getRawMany();

    return {
      summary: [
        { label: '정상 재고', value: normal },
        { label: '만료 임박', value: warning },
        { label: '위험/만료', value: danger },
      ],
      monthlyData,
    };
  }

  async createStockEntry(data: any) {
    return await this.stockRepository.manager.transaction(async (transactionalEntityManager) => {
      const newStock = transactionalEntityManager.create(Stock, data);
      return await transactionalEntityManager.save(newStock);
    });
  }
}