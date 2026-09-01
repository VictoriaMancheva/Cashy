package com.cashy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReceiptScanResponse {
    private Double amount;
    private String description;
    private String date;
    private String receiptImage;
}
