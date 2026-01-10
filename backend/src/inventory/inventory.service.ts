import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * 재고 수량 변경 (입/출고 처리)
   * Race Condition 방지를 위해 Prisma Transaction 및 인터랙티브 락 활용
   */
  async processTransaction(barcode: String, quantity: number, type: TransactionType) {
    return this.prisma.$transaction(async (tx) => {
      // 1. 상품 확인
      const product = await tx.product.findUnique({
        where: { barcode: barcode.toString() },
        include: { stock: true },
      });

      if (!product) throw new Error('상품을 찾을 수 없습니다.');

      // 2. 재고 수량 계산
      const change = type === TransactionType.IN ? quantity : -quantity;
      const newQuantity = (product.stock?.quantity || 0) + change;

      if (newQuantity < 0) {
        throw new ConflictException('재고가 부족합니다.');
      }

      // 3. 재고 업데이트 및 로그 생성 (원자적 작업)
      const updatedStock = await tx.stock.upsert({
        where: { productId: product.id },
        update: { quantity: newQuantity },
        create: { productId: product.id, quantity: newQuantity },
      });

      await tx.inventoryLog.create({
        data: {
          productId: product.id,
          type: type,
          quantity: quantity,
        },
      });

      return { product, updatedStock };
    });
  }
}