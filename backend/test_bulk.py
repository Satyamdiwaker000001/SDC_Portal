import requests

# 1. Login
login_data = {'username': 'admin@sdc.com', 'password': 'admin123'}
res = requests.post('http://127.0.0.1:8000/api/v1/auth/login', data=login_data)
token = res.json().get('access_token')

# 2. Upload
files = {'file': ('mock_users.csv', open(r'C:\Users\Admin1\.gemini\antigravity-ide\brain\ea5df906-c9f2-4dc1-b456-2450121aa517\scratch\mock_users.csv', 'rb'), 'text/csv')}
headers = {'Authorization': f'Bearer {token}'}
res2 = requests.post('http://127.0.0.1:8000/api/v1/users/bulk-upload', files=files, headers=headers)

print(res2.status_code)
print(res2.json())
