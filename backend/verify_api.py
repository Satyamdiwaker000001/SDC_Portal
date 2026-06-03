import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

def verify_all():
    print("--- STARTING API VERIFICATION ---")
    
    # 1. Login
    login_payload = {
        "user_id": "ROOT-ADMIN",
        "password": "admin123"
    }
    print(f"[*] Authenticating with user ID: {login_payload['user_id']}...")
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    except Exception as e:
        print(f"[FAIL] Could not connect to API: {e}")
        sys.exit(1)
        
    if r.status_code != 200:
        print(f"[FAIL] Login failed: {r.status_code} - {r.text}")
        sys.exit(1)
        
    login_data = r.json()
    token = login_data["token"]
    role = login_data["role"]
    name = login_data["name"]
    print(f"[PASS] Authentication successful! Logged in as {name} ({role})")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    # 2. Get /auth/me
    print("[*] Verifying /auth/me...")
    r = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    if r.status_code == 200:
        print(f"[PASS] /auth/me responded: {r.json()['email']}")
    else:
        print(f"[FAIL] /auth/me: {r.status_code} - {r.text}")
        
    # 3. Create Developer
    print("[*] Creating a developer member via /admin/users/developers...")
    import random
    rand_id = random.randint(1000, 9999)
    dev_payload = {
        "id": f"DEV-{rand_id}",
        "name": "Verify Developer",
        "email": f"verify_dev_{rand_id}@sdc.portal",
        "spec": "Frontend Engineer",
        "joinDate": "2026-06-01",
        "password": "VerifyPassword123"
    }
    r = requests.post(f"{BASE_URL}/admin/users/developers", json=dev_payload, headers=headers)
    if r.status_code in [200, 201]:
        print(f"[PASS] Developer created successfully: {r.json()['message']}")
    else:
        print(f"[FAIL] /admin/users/developers: {r.status_code} - {r.text}")

    # 4. Get Teams
    print("[*] Fetching teams via /teams...")
    r = requests.get(f"{BASE_URL}/teams", headers=headers)
    if r.status_code == 200:
        print(f"[PASS] /teams count: {len(r.json())}")
    else:
        print(f"[FAIL] /teams: {r.status_code} - {r.text}")

    # 5. Get Projects
    print("[*] Fetching projects via /projects...")
    r = requests.get(f"{BASE_URL}/projects", headers=headers)
    if r.status_code == 200:
        print(f"[PASS] /projects count: {len(r.json())}")
    else:
        print(f"[FAIL] /projects: {r.status_code} - {r.text}")

    print("--- API VERIFICATION COMPLETE ---")

if __name__ == "__main__":
    verify_all()
