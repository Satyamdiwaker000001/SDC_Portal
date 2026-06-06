import requests

BASE = 'http://localhost:8000/api/v1'

# 1. Login as mentor (field is user_id, response key is token)
r = requests.post(f'{BASE}/auth/login', json={'user_id': 'mentor@sdc.com', 'password': 'password123'})
if r.status_code != 200:
    print(f'LOGIN FAILED: {r.status_code} - {r.text}')
    exit(1)

data = r.json()
token = data['token']
headers = {'Authorization': f'Bearer {token}'}
print(f'[OK] Login: mentor@sdc.com')
print(f'     Role: {data.get("role", "unknown")}')
print(f'     Name: {data.get("name", "unknown")}')
print(f'     ID:   {data.get("id", "unknown")}')

# 2. Get mentor teams
r2 = requests.get(f'{BASE}/mentor/teams', headers=headers)
print(f'\n[OK] GET /mentor/teams -> {r2.status_code}: {len(r2.json())} teams')
teams = r2.json()
for t in teams:
    print(f'     - {t["id"]}: {t["name"]}')

# 3. Get all projects
r3 = requests.get(f'{BASE}/projects', headers=headers)
projects = r3.json()
print(f'\n[OK] GET /projects -> {r3.status_code}: {len(projects)} projects total')

# Find projects belonging to mentor teams
team_ids = [t['id'] for t in teams]
supervised = [p for p in projects if p.get('teamId') in team_ids]
print(f'     Supervised projects: {len(supervised)}')
for p in supervised:
    print(f'     - {p["id"]}: {p["name"]} (team: {p["teamId"]}, status: {p["status"]})')

# 4. Check SRS for each supervised project
print()
for p in supervised:
    rs = requests.get(f'{BASE}/projects/{p["id"]}/srs', headers=headers)
    if rs.status_code == 200:
        srs = rs.json()
        print(f'[SRS] {p["id"]} ({p["name"]}): status={srs["status"]}')
        if srs['status'] == 'PENDING':
            print(f'      -> PENDING found! Calling approve endpoint...')
            ra = requests.post(
                f'{BASE}/mentor/projects/{p["id"]}/srs/approve',
                json={'remarks': 'Approved by Mentor - API Test'},
                headers=headers
            )
            print(f'      Approve: {ra.status_code} - {ra.text[:300]}')
            if ra.status_code == 200:
                rs2 = requests.get(f'{BASE}/projects/{p["id"]}/srs', headers=headers)
                if rs2.status_code == 200:
                    new_status = rs2.json()['status']
                    print(f'      Re-check SRS status: {new_status}')
                    if new_status == 'APPROVED':
                        print(f'      [PASS] SRS successfully transitioned PENDING -> APPROVED')
                    else:
                        print(f'      [FAIL] Expected APPROVED, got {new_status}')
    else:
        print(f'[SRS] {p["id"]}: no SRS found ({rs.status_code})')

print('\n[DONE] Mentor API verification complete.')
