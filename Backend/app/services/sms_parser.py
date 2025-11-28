import re
from datetime import datetime
from typing import Optional, Dict, Any

class SMSParser:
    def __init__(self):
        # Regex patterns for common bank SMS formats (Indian context primarily based on user request context)
        self.patterns = [
            # Pattern 1: "Rs. <amount> spent on <card> at <merchant> on <date>"
            r"(?i)(?:rs\.?|inr)\s*([\d,]+(?:\.\d{2})?)\s*(?:spent|debited|paid)\s*(?:on|using|via)?\s*(?:card|upi|wallet)?\s*.*?\s*(?:at|to)\s*([a-zA-Z0-9\s\.\-\&]+?)\s*(?:on|at)\s*(\d{2}[-/]\d{2}(?:[-/]\d{2,4})?)",
            
            # Pattern 2: "Debited: Rs. <amount> from A/c ... to <merchant>"
            r"(?i)debited[:\s]*rs\.?\s*([\d,]+(?:\.\d{2})?).*?to\s*([a-zA-Z0-9\s\.\-\&]+?)(?:\s+on\s+|\.|$)",
            
            # Pattern 3: "Transaction of Rs. <amount> made at <merchant>"
            r"(?i)transaction.*?rs\.?\s*([\d,]+(?:\.\d{2})?).*?at\s*([a-zA-Z0-9\s\.\-\&]+?)(?:\s+on\s+|\.|$)",
             
             # Pattern 4: "Paid Rs. <amount> to <merchant>"
            r"(?i)paid\s*rs\.?\s*([\d,]+(?:\.\d{2})?)\s*to\s*([a-zA-Z0-9\s\.\-\&]+?)(?:\s+on\s+|\.|$)"
        ]
        
        # Keywords to identify subscription-like merchants
        self.subscription_keywords = [
            'netflix', 'spotify', 'amazon prime', 'hotstar', 'youtube', 'apple', 'google one', 
            'microsoft', 'adobe', 'gym', 'fitness', 'subscription'
        ]
        
        # Simple keyword mapping for categories
        self.category_keywords = {
            'food': ['swiggy', 'zomato', 'restaurant', 'cafe', 'burger', 'pizza', 'food', 'dining'],
            'transport': ['uber', 'ola', 'rapido', 'fuel', 'petrol', 'shell', 'bpcl', 'hpcl', 'metro'],
            'shopping': ['amazon', 'flipkart', 'myntra', 'zara', 'h&m', 'retail', 'store', 'mart', 'mall'],
            'entertainment': ['netflix', 'pvr', 'inox', 'movie', 'cinema', 'bookmyshow', 'hotstar', 'spotify'],
            'bills': ['electricity', 'water', 'gas', 'bill', 'recharge', 'jio', 'airtel', 'vi', 'bescom'],
            'groceries': ['bigbasket', 'blinkit', 'zepto', 'dmart', 'reliance fresh', 'grocery']
        }

    def parse(self, sms_text: str) -> Dict[str, Any]:
        """
        Parses the SMS text and returns a dictionary with extracted details.
        """
        cleaned_text = sms_text.strip()
        data = {
            'amount': 0.0,
            'merchant': None,
            'date': datetime.now(), # Default to current time if date not found
            'category': 'General',
            'is_subscription': False,
            'payment_method': 'Unknown'
        }

        # 1. Extract Amount and Merchant
        match_found = False
        for pattern in self.patterns:
            match = re.search(pattern, cleaned_text)
            if match:
                try:
                    amount_str = match.group(1).replace(',', '')
                    data['amount'] = float(amount_str)
                    data['merchant'] = match.group(2).strip()
                    
                    # Try to parse date if present in group 3
                    if len(match.groups()) >= 3 and match.group(3):
                         # Basic date parsing logic (can be enhanced)
                         # Assuming DD-MM-YY or DD/MM/YY
                         date_str = match.group(3)
                         # Add logic to parse date_str to datetime object if needed
                         # For now, we keep the default 'now' or implement simple parsing
                         pass
                         
                    match_found = True
                    break
                except Exception as e:
                    print(f"Error parsing match: {e}")
                    continue
        
        if not match_found:
             # Fallback: simple heuristic if regex fails
             # Look for "Rs." and numbers
             amount_match = re.search(r"(?:rs\.?|inr)\s*([\d,]+(?:\.\d{2})?)", cleaned_text, re.IGNORECASE)
             if amount_match:
                 data['amount'] = float(amount_match.group(1).replace(',', ''))
        
        # 2. Determine Category
        if data['merchant']:
            merchant_lower = data['merchant'].lower()
            for category, keywords in self.category_keywords.items():
                if any(keyword in merchant_lower for keyword in keywords):
                    data['category'] = category.capitalize()
                    break
        
        # 3. Check for Subscription
        if data['merchant']:
            merchant_lower = data['merchant'].lower()
            if any(keyword in merchant_lower for keyword in self.subscription_keywords):
                data['is_subscription'] = True
                # Heuristic: If amount is standard subscription price (e.g., 199, 499, 999), it reinforces it
                # For now, relying on merchant name
        
        # 4. Determine Payment Method (Simple keyword search)
        lower_text = cleaned_text.lower()
        if 'upi' in lower_text:
            data['payment_method'] = 'UPI'
        elif 'card' in lower_text or 'debit' in lower_text or 'credit' in lower_text:
            data['payment_method'] = 'Card'
        elif 'wallet' in lower_text or 'paytm' in lower_text or 'phonepe' in lower_text: # PhonePe/Paytm can be UPI too, but often wallet
            data['payment_method'] = 'Wallet'
            
        return data

# Example Usage
if __name__ == "__main__":
    parser = SMSParser()
    sample_sms = "Paid Rs. 450.00 to Swiggy using UPI on 28-11-24"
    print(parser.parse(sample_sms))
