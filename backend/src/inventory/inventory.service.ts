import { Injectable, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { InventoryTransaction } from './entities/transaction.entity';

@Injectable()    
export class InventoryService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  /**
   * Critical Section: Stock Movement with Concurrency Control
   * Ensures 0% error rate in stock tracking using Pessimistic Locking
   */
  async processStockMovement(productId: string, amount: number, type: 'INBOUND' | 'OUTBOUND') {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Lock the product row for update to prevent concurrent race conditions
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' }
      });

      if (!product) throw new Error('Product Not Found');

      // 2. Calculate New Stock
      const change = type === 'INBOUND' ? amount : -amount;
      const newStock = Number(product.current_stock) + change;

      if (newStock < 0) {
        throw new ConflictException('Insufficient stock for this operation');
      }

      // 3. Record Transaction (Atomicity)
      const transaction = queryRunner.manager.create(InventoryTransaction, {
        product_id: productId,
        transaction_type: type,
        quantity: amount,
      });
      await queryRunner.manager.save(transaction);

      // 4. Update Product Stock
      product.current_stock = newStock;
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      return { success: true, newStock };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err.message);
    } finally {
      await queryRunner.release();
    }
  }
}