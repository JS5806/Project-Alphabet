# Cosmetic Expiry Management System - Requirements & Logic

## 1. Core Logic: Expiry Calculation
The system must calculate the **Actual Expiry Date** based on two main factors:
1.  **Expiry Date (유통기한):** The absolute date printed on the packaging.
2.  **PAO (Period After Opening, 개봉 후 사용기간):** The duration (in months) the product remains safe after being opened.

**Formula:**
`Final_Expiry_Date = Min(Expiry_Date, Opening_Date + PAO_Months)`

## 2. User Stories
- As a user, I want to input the product name, brand, and its printed expiry date.
- As a user, I want to record the date I opened the product.
- As a user, I want to select the PAO (e.g., 6M, 12M, 24M) from a list of icons.
- As a user, I want to see a visual indicator (Traffic Light system) showing how much time is left.

## 3. Data Integrity Rules
- `Opening_Date` cannot be in the future.
- `Opening_Date` must be earlier than the `Expiry_Date`.
- `PAO_Months` must be a positive integer.