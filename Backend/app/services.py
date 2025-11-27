import re
from datetime import datetime
from typing import Dict, Any, List

class SMSParser:
    def parse(self, sender: str, body: str) -> Dict[str, Any]:
        # Basic Regex for common bank formats (Example: HDFC, SBI)
        # "Rs 500 debited from a/c **1234 to STARBUCKS on 25-11-25"
        
        amount_pattern = r"(?:Rs\.?|INR)\s*([\d,]+(?:\.\d{2})?)"
        merchant_pattern = r"(?:to|at)\s+([A-Za-z0-9\s]+?)(?:\s+on|\s+for|\.$)"
        
        amount_match = re.search(amount_pattern, body, re.IGNORECASE)
        merchant_match = re.search(merchant_pattern, body, re.IGNORECASE)
        
        amount = 0.0
        if amount_match:
            amount_str = amount_match.group(1).replace(",", "")
            amount = float(amount_str)
            
        merchant = "Unknown"
        if merchant_match:
            merchant = merchant_match.group(1).strip()
            
        # Simple categorization logic
        category = self._categorize(merchant)
        
        return {
            "amount": amount,
            "merchant": merchant,
            "category": category,
            "date": datetime.now(), # In real app, parse date from SMS
            "type": "debit" if "debit" in body.lower() else "credit"
        }

    def _categorize(self, merchant: str) -> str:
        merchant = merchant.lower()
        if any(x in merchant for x in ["starbucks", "coffee", "mcdonalds", "swiggy", "zomato"]):
            return "Food & Dining"
        elif any(x in merchant for x in ["uber", "ola", "fuel", "petrol"]):
            return "Transportation"
        elif any(x in merchant for x in ["netflix", "spotify", "prime", "apple"]):
            return "Subscriptions"
        elif any(x in merchant for x in ["amazon", "flipkart", "myntra"]):
            return "Shopping"
        return "General"

class LeakDetector:
    def detect(self, transaction: Dict[str, Any], history: List[Dict[str, Any]]) -> Dict[str, Any]:
        is_leak = False
        severity = None
        reason = None
        
        # 1. Check for small recurring coffee/food
        if transaction["category"] == "Food & Dining" and transaction["amount"] < 500:
            # Check if we have many of these
            recent_food = [t for t in history if t["category"] == "Food & Dining" and t["amount"] < 500]
            if len(recent_food) > 5:
                is_leak = True
                severity = "medium"
                reason = "Frequent small food purchases"

        # 2. Check for subscription price hike
        if transaction["category"] == "Subscriptions":
            # Find previous transaction for same merchant
            prev = next((t for t in history if t["merchant"] == transaction["merchant"]), None)
            if prev and transaction["amount"] > prev["amount"]:
                is_leak = True
                severity = "high"
                reason = f"Price increased from {prev['amount']} to {transaction['amount']}"

        return {
            "is_leak": is_leak,
            "leak_severity": severity,
            "leak_reason": reason
        }

class AlternativeSuggester:
    def suggest(self, transaction: Dict[str, Any]) -> str:
        if transaction["category"] == "Food & Dining":
            return "Cook at home or use a coffee subscription to save up to 40%."
        elif transaction["category"] == "Subscriptions":
            return "Check for family plans or annual billing discounts."
        elif transaction["category"] == "Transportation":
            return "Consider a monthly pass or carpooling."
        return "Track this expense to see if it's necessary."
