import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_endpoint(name, method, endpoint, payload=None, headers=None):
    print(f"[*] Testing {name}...")
    try:
        if method == "GET":
            response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
        elif method == "POST":
            response = requests.post(f"{BASE_URL}{endpoint}", json=payload, headers=headers)
        
        if response.status_code in [200, 201]:
            print(f" [PASS] {name} successful ({response.status_code})")
            return response.json()
        else:
            print(f" [FAIL] {name} returned {response.status_code}: {response.text}")
    except Exception as e:
        print(f" [ERROR] {name} failed: {e}")
    return None

def run_diagnostics():
    print("=== SDC PORTAL SYSTEM DIAGNOSTICS ===")
    
    # 1. Health & Auth
    test_endpoint("System Root", "GET", "/")
    
    # 2. Users Registry
    # Note: Requires login for most endpoints, but we can test lookup (admin only)
    # We'll skip complex auth flows in this script and focus on baseline availability
    test_endpoint("User Search Lookup", "GET", "/users/lookup/placeholder")
    
    # 3. Teams Matrix
    test_endpoint("Teams List", "GET", "/teams/")
    
    # 4. Projects Matrix
    test_endpoint("Projects List", "GET", "/projects/")
    
    # 5. Application Sector
    test_endpoint("Recruitment Status", "GET", "/applications/status")
    
    # 6. Announcements
    test_endpoint("Global Announcements", "GET", "/announcements/")
    
    print("=====================================")

if __name__ == "__main__":
    run_diagnostics()
