package com.smartstock.service;

import com.smartstock.entity.StockRecord;
import com.smartstock.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    /**
     * FIFO-based Stock Out Logic
     */
    @Transactional
    public void processStockOut(Long productId, int quantityToOut) {
        // Fetch available IN records for this product, ordered by oldest first
        List<StockRecord> availableStock = stockRepository.findAvailableStockFIFO(productId);
        
        int remainingToProcess = quantityToOut;

        for (StockRecord record : availableStock) {
            if (remainingToProcess <= 0) break;

            int currentRemaining = record.getRemainingQuantity();
            if (currentRemaining <= remainingToProcess) {
                remainingToProcess -= currentRemaining;
                record.setRemainingQuantity(0);
            } else {
                record.setRemainingQuantity(currentRemaining - remainingToProcess);
                remainingToProcess = 0;
            }
            stockRepository.save(record);
        }

        if (remainingToProcess > 0) {
            throw new RuntimeException("Insufficient stock for FIFO processing");
        }
    }
}