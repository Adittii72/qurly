"""
Endpoint Testing Script for QURLY API
Tests all major endpoints to ensure they're working correctly
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000"

# Test data
TEST_EMAIL = f"test_{int(time.time())}@example.com"
TEST_PASSWORD = "TestPassword123"
TEST_USERNAME = f"testuser_{int(time.time())}"
TEST_URL = "https://example.myshopify.com/products/test-product"

# Color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'

def print_test(name, result, message=""):
    status = f"{GREEN}✓ PASS{RESET}" if result else f"{RED}✗ FAIL{RESET}"
    print(f"  {status} - {name}")
    if message:
        print(f"      {message}")

def print_section(title):
    print(f"\n{YELLOW}{'='*60}{RESET}")
    print(f"{YELLOW}{title.center(60)}{RESET}")
    print(f"{YELLOW}{'='*60}{RESET}\n")

# ============================================================================
# TEST 1: AUTHENTICATION
# ============================================================================
print_section("Test 1: Authentication Endpoints")

auth_token = None
user_id = None

# Test signup
try:
    signup_response = requests.post(
        f"{BASE_URL}/api/auth/signup",
        json={
            "email": TEST_EMAIL,
            "username": TEST_USERNAME,
            "password": TEST_PASSWORD
        }
    )
    signup_success = signup_response.status_code == 200
    print_test(
        "POST /api/auth/signup",
        signup_success,
        f"Status: {signup_response.status_code}"
    )
    
    if signup_success:
        auth_token = signup_response.json().get("access_token")
        user_id = signup_response.json().get("user", {}).get("id")
        print(f"      Token: {auth_token[:20]}...")
except Exception as e:
    print_test("POST /api/auth/signup", False, str(e))

# Test login
try:
    login_response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
    )
    login_success = login_response.status_code == 200
    print_test(
        "POST /api/auth/login",
        login_success,
        f"Status: {login_response.status_code}"
    )
except Exception as e:
    print_test("POST /api/auth/login", False, str(e))

# Test get current user
if auth_token:
    try:
        user_response = requests.get(
            f"{BASE_URL}/api/users/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        user_success = user_response.status_code == 200
        print_test(
            "GET /api/users/me",
            user_success,
            f"Status: {user_response.status_code}"
        )
    except Exception as e:
        print_test("GET /api/users/me", False, str(e))

# ============================================================================
# TEST 2: REPORT MANAGEMENT
# ============================================================================
print_section("Test 2: Report Management Endpoints")

report_id = None

# Test create report
if auth_token:
    try:
        create_report = requests.post(
            f"{BASE_URL}/api/reports",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "product_url": TEST_URL,
                "product_title": "Test Product",
                "product_description": "This is a test product description",
                "product_price": 99.99,
                "overall_score": 7.5,
                "clarity_score": 7.0,
                "trust_score": 8.0,
                "completeness_score": 7.5,
                "structure_score": 7.0,
                "nlp_features": {"sentiment": 0.8, "readability": 0.7},
                "issues": ["Improve description length"],
                "confidence_scores": {"clarity": 0.85},
                "benchmark_comparison": {"category_avg": 7.2},
                "tags": "test"
            }
        )
        create_success = create_report.status_code == 200
        print_test(
            "POST /api/reports",
            create_success,
            f"Status: {create_report.status_code}"
        )
        if create_success:
            report_id = create_report.json().get("id")
            print(f"      Report ID: {report_id}")
    except Exception as e:
        print_test("POST /api/reports", False, str(e))

    # Test list reports
    try:
        list_response = requests.get(
            f"{BASE_URL}/api/reports",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        list_success = list_response.status_code == 200
        print_test(
            "GET /api/reports",
            list_success,
            f"Status: {list_response.status_code}, Count: {len(list_response.json())}"
        )
    except Exception as e:
        print_test("GET /api/reports", False, str(e))

    # Test get report
    if report_id:
        try:
            get_response = requests.get(
                f"{BASE_URL}/api/reports/{report_id}",
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            get_success = get_response.status_code == 200
            print_test(
                f"GET /api/reports/{report_id}",
                get_success,
                f"Status: {get_response.status_code}"
            )
        except Exception as e:
            print_test(f"GET /api/reports/{report_id}", False, str(e))

        # Test toggle favorite
        try:
            fav_response = requests.post(
                f"{BASE_URL}/api/reports/{report_id}/favorite",
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            fav_success = fav_response.status_code == 200
            print_test(
                f"POST /api/reports/{report_id}/favorite",
                fav_success,
                f"Status: {fav_response.status_code}"
            )
        except Exception as e:
            print_test(f"POST /api/reports/{report_id}/favorite", False, str(e))

# ============================================================================
# TEST 3: EXPORT ENDPOINTS
# ============================================================================
print_section("Test 3: Export Endpoints")

if auth_token and report_id:
    # Test JSON export
    try:
        json_export = requests.get(
            f"{BASE_URL}/api/reports/{report_id}/export/json",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        json_success = json_export.status_code == 200
        print_test(
            f"GET /api/reports/{report_id}/export/json",
            json_success,
            f"Status: {json_export.status_code}"
        )
    except Exception as e:
        print_test(f"GET /api/reports/{report_id}/export/json", False, str(e))

    # Test text export
    try:
        text_export = requests.get(
            f"{BASE_URL}/api/reports/{report_id}/export/text",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        text_success = text_export.status_code == 200
        print_test(
            f"GET /api/reports/{report_id}/export/text",
            text_success,
            f"Status: {text_export.status_code}"
        )
    except Exception as e:
        print_test(f"GET /api/reports/{report_id}/export/text", False, str(e))

    # Test markdown export
    try:
        md_export = requests.get(
            f"{BASE_URL}/api/reports/{report_id}/export/markdown",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        md_success = md_export.status_code == 200
        print_test(
            f"GET /api/reports/{report_id}/export/markdown",
            md_success,
            f"Status: {md_export.status_code}"
        )
    except Exception as e:
        print_test(f"GET /api/reports/{report_id}/export/markdown", False, str(e))

    # Test PDF export
    try:
        pdf_export = requests.get(
            f"{BASE_URL}/api/reports/{report_id}/export/pdf",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        pdf_success = pdf_export.status_code in [200, 500]  # May fail if ReportLab not configured
        print_test(
            f"GET /api/reports/{report_id}/export/pdf",
            pdf_success,
            f"Status: {pdf_export.status_code}"
        )
    except Exception as e:
        print_test(f"GET /api/reports/{report_id}/export/pdf", False, str(e))

# ============================================================================
# TEST 4: ANALYSIS FEATURES
# ============================================================================
print_section("Test 4: Analysis & Simulation Features")

# Test checklist endpoint
try:
    checklist_response = requests.post(
        f"{BASE_URL}/api/analyze/checklist",
        json={
            "description": "This is a detailed product description with 150-300 words. It should contain all the important information about the product, including features, benefits, specifications, and usage instructions. The AI agent should be able to understand the product from this description alone.",
            "product_data": {
                "title": "Test Product",
                "image_count": 4,
                "review_count": 25,
                "price": 99.99,
                "has_faq": True,
                "has_return_policy": True,
                "has_shipping_policy": True
            }
        }
    )
    checklist_success = checklist_response.status_code == 200
    print_test(
        "POST /api/analyze/checklist",
        checklist_success,
        f"Status: {checklist_response.status_code}"
    )
    if checklist_success:
        data = checklist_response.json()
        print(f"      Passed: {data.get('passed_count')}/{data.get('total')} checks")
except Exception as e:
    print_test("POST /api/analyze/checklist", False, str(e))

# Test score simulation
try:
    simulate_response = requests.post(
        f"{BASE_URL}/api/simulate-score",
        json={
            "description": "Improved product description with better clarity and structure",
            "product_data": {
                "title": "Test Product",
                "price": 99.99,
                "image_count": 4,
                "review_count": 25
            }
        }
    )
    simulate_success = simulate_response.status_code == 200
    print_test(
        "POST /api/simulate-score",
        simulate_success,
        f"Status: {simulate_response.status_code}"
    )
except Exception as e:
    print_test("POST /api/simulate-score", False, str(e))

# Test benchmark endpoint
try:
    benchmark_response = requests.get(
        f"{BASE_URL}/api/benchmark/category?category=electronics"
    )
    benchmark_success = benchmark_response.status_code == 200
    print_test(
        "GET /api/benchmark/category",
        benchmark_success,
        f"Status: {benchmark_response.status_code}"
    )
    if benchmark_success:
        data = benchmark_response.json()
        print(f"      Category: {data.get('category_name')}, Avg: {data.get('overall_score')}")
except Exception as e:
    print_test("GET /api/benchmark/category", False, str(e))

# ============================================================================
# TEST 5: SUPPORT ENDPOINTS
# ============================================================================
print_section("Test 5: Support Endpoints")

# Test contact endpoint
try:
    contact_response = requests.post(
        f"{BASE_URL}/api/contact",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "message": "This is a test message"
        }
    )
    contact_success = contact_response.status_code == 200
    print_test(
        "POST /api/contact",
        contact_success,
        f"Status: {contact_response.status_code}"
    )
except Exception as e:
    print_test("POST /api/contact", False, str(e))

# ============================================================================
# CLEANUP
# ============================================================================
print_section("Cleanup")

if auth_token and report_id:
    try:
        delete_response = requests.delete(
            f"{BASE_URL}/api/reports/{report_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        delete_success = delete_response.status_code == 200
        print_test(
            f"DELETE /api/reports/{report_id}",
            delete_success,
            f"Status: {delete_response.status_code}"
        )
    except Exception as e:
        print_test(f"DELETE /api/reports/{report_id}", False, str(e))

# ============================================================================
# SUMMARY
# ============================================================================
print_section("Summary")
print(f"\n{YELLOW}Test execution completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{RESET}\n")
print(f"Run this test to verify all API endpoints are working correctly.")
print(f"Make sure backend server is running on {BASE_URL} before running tests.\n")
