import requests
import json

BASE_URL = "http://localhost:8000"

def test_mobile_flow():
    print("🚀 Starting Mobile Flow Test...\n")

    # 1. Create a Test User (if not exists)
    # Ideally, we should have a user. Let's assume user_id=1 exists or create one.
    # For this test, we'll try to use user_id=1. If it fails, we might need to seed a user.
    user_id = 1
    
    # 2. Test SMS Processing (Expense)
    print("Testing SMS Processing (Expense)...")
    sms_payload = {
        "user_id": user_id,
        "sms_text": "Paid Rs. 450.00 to Swiggy using UPI on 28-11-24"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/mobile/sms/process", json=sms_payload)
        if response.status_code == 200:
            print("✅ SMS Processed Successfully!")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"❌ SMS Processing Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error connecting to API: {e}")
        return

    print("\n--------------------------------------------------\n")

    # 3. Test SMS Processing (Subscription)
    print("Testing SMS Processing (Subscription)...")
    sub_payload = {
        "user_id": user_id,
        "sms_text": "Debited Rs. 199.00 for Netflix subscription via Credit Card"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/mobile/sms/process", json=sub_payload)
        if response.status_code == 200:
            print("✅ Subscription SMS Processed Successfully!")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"❌ Subscription Processing Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error connecting to API: {e}")

    print("\n--------------------------------------------------\n")

    # 4. Test Home Page Data Aggregation
    print("Testing Home Page Data Aggregation...")
    try:
        response = requests.get(f"{BASE_URL}/mobile/home?user_id={user_id}")
        if response.status_code == 200:
            data = response.json()
            print("✅ Home Page Data Fetched Successfully!")
            print(f"Total Monthly Expense: {data['total_monthly_expense']}")
            print("Top Categories:")
            for cat in data['top_categories']:
                print(f"  - {cat['name']}: {cat['amount']}")
            
            print("Recent Transactions:")
            for tx in data['recent_transactions']:
                print(f"  - {tx['merchant']} ({tx['category']}): {tx['amount']}")
                
            print("Recent Subscriptions:")
            for sub in data['recent_subscriptions']:
                print(f"  - {sub['name']}: {sub['amount']} ({sub['billing_cycle']})")
        else:
            print(f"❌ Home Page Data Failed: {response.text}")
    except Exception as e:
        print(f"❌ Error connecting to API: {e}")

if __name__ == "__main__":
    test_mobile_flow()
