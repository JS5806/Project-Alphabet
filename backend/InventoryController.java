package com.smartstock.api;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @GetMapping("/status")
    public List<InventoryItem> getStatus() {
        // Business Logic for fetching current inventory with safety stock calculation
        return inventoryService.getAllItems();
    }

    @PostMapping("/transaction")
    public TransactionResult processSale(@RequestBody SaleRequest request) {
        // Ensuring transactional integrity using @Transactional
        return inventoryService.updateStock(request);
    }
}