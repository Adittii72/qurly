"""Detailed API Testing"""
import requests
import json

print('=' * 80)
print('DETAILED BACKEND API TEST')
print('=' * 80)

# Test 1: Health check
print('\n1. Health Check')
try:
    r = requests.get('http://localhost:8000/api/health', timeout=5)
    print(f'   Status: {r.status_code}')
    print(f'   Response: {r.json()}')
except Exception as e:
    print(f'   Error: {e}')

# Test 2: Root endpoint
print('\n2. Root Endpoint')
try:
    r = requests.get('http://localhost:8000/', timeout=5)
    print(f'   Status: {r.status_code}')
    print(f'   Response: {r.json()}')
except Exception as e:
    print(f'   Error: {e}')

# Test 3: Try signup with simple payload
print('\n3. Signup Test')
try:
    payload = {
        'email': 'judge@qurly.com',
        'username': 'judge_user',
        'password': 'JudgePass123'
    }
    r = requests.post('http://localhost:8000/api/auth/signup', json=payload, timeout=10)
    print(f'   Status: {r.status_code}')
    if r.status_code == 200:
        print(f'   Success: User created')
        print(f'   Response: {json.dumps(r.json(), indent=4)[:300]}')
    else:
        print(f'   Error response: {r.text[:300]}')
except Exception as e:
    print(f'   Exception: {type(e).__name__}: {e}')

# Test 4: Try checklist endpoint (known to work)
print('\n4. Checklist Test (known working)')
try:
    payload = {
        'description': 'This is a test product description with important details',
        'product_data': {
            'title': 'Test Product',
            'description': 'Test product description',
            'review_count': 5,
            'has_return_policy': True
        }
    }
    r = requests.post('http://localhost:8000/api/analyze/checklist', json=payload, timeout=5)
    print(f'   Status: {r.status_code}')
    if r.status_code == 200:
        result = r.json()
        print(f'   Success: Checklist returned items passed')
    else:
        print(f'   Error: {r.text[:200]}')
except Exception as e:
    print(f'   Error: {e}')

# Test 5: Contact endpoint
print('\n5. Contact Endpoint Test')
try:
    payload = {
        'name': 'Judge User',
        'email': 'contact@test.com',
        'message': 'Great platform!'
    }
    r = requests.post('http://localhost:8000/api/contact', json=payload, timeout=5)
    print(f'   Status: {r.status_code}')
    if r.status_code == 200:
        print(f'   Success: Contact message sent')
    else:
        print(f'   Error: {r.text[:200]}')
except Exception as e:
    print(f'   Error: {e}')

# Test 6: Benchmark endpoint
print('\n6. Benchmark Test')
try:
    r = requests.get('http://localhost:8000/api/benchmark/category?category=electronics', timeout=5)
    print(f'   Status: {r.status_code}')
    if r.status_code == 200:
        result = r.json()
        print(f'   Success: Category={result.get("category")}, Avg Score={result.get("average_score")}')
    else:
        print(f'   Error: {r.text[:200]}')
except Exception as e:
    print(f'   Error: {e}')

print('\n' + '=' * 80)
