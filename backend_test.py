import requests
import sys
import json
from datetime import datetime

class QuizAPITester:
    def __init__(self, base_url="https://pati-devta-quiz.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_result_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error Response: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Error Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )
        return success

    def test_submit_quiz(self):
        """Test quiz submission"""
        test_data = {
            "user_name": f"TestUser_{datetime.now().strftime('%H%M%S')}",
            "yes_count": 12,
            "no_count": 3,
            "answers": [
                {"questionId": 1, "question": "Test question 1", "answer": "yes"},
                {"questionId": 2, "question": "Test question 2", "answer": "yes"},
                {"questionId": 3, "question": "Test question 3", "answer": "no"}
            ]
        }
        
        success, response = self.run_test(
            "Submit Quiz Result",
            "POST",
            "api/quiz/submit",
            200,
            data=test_data
        )
        
        if success and 'id' in response:
            self.created_result_id = response['id']
            print(f"Created result ID: {self.created_result_id}")
            
            # Validate response structure
            required_fields = ['id', 'user_name', 'score_percentage', 'pati_rating', 'yes_count', 'no_count', 'timestamp']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in response: {field}")
                    return False
            
            # Validate score calculation
            expected_percentage = (12 / 15) * 100  # 80%
            if abs(response['score_percentage'] - expected_percentage) > 0.1:
                print(f"❌ Score calculation error. Expected: {expected_percentage}, Got: {response['score_percentage']}")
                return False
            
            print(f"✅ Score calculation correct: {response['score_percentage']}%")
            print(f"✅ Pati rating: {response['pati_rating']}")
            
        return success

    def test_get_all_results(self):
        """Test getting all quiz results"""
        success, response = self.run_test(
            "Get All Quiz Results",
            "GET",
            "api/quiz/results",
            200
        )
        
        if success:
            if isinstance(response, list):
                print(f"✅ Returned {len(response)} results")
                if len(response) > 0:
                    # Check if our created result is in the list
                    if self.created_result_id:
                        found = any(r.get('id') == self.created_result_id for r in response)
                        if found:
                            print(f"✅ Found our created result in the list")
                        else:
                            print(f"⚠️ Our created result not found in the list")
            else:
                print(f"❌ Expected list, got {type(response)}")
                return False
                
        return success

    def test_get_specific_result(self):
        """Test getting a specific quiz result"""
        if not self.created_result_id:
            print("⚠️ Skipping specific result test - no result ID available")
            return True
            
        success, response = self.run_test(
            "Get Specific Quiz Result",
            "GET",
            f"api/quiz/result/{self.created_result_id}",
            200
        )
        
        if success:
            # Validate response structure
            required_fields = ['id', 'user_name', 'score_percentage', 'pati_rating', 'yes_count', 'no_count', 'timestamp']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in response: {field}")
                    return False
            
            if response['id'] != self.created_result_id:
                print(f"❌ ID mismatch. Expected: {self.created_result_id}, Got: {response['id']}")
                return False
                
            print(f"✅ Retrieved correct result with ID: {response['id']}")
            
        return success

    def test_invalid_result_id(self):
        """Test getting a non-existent result"""
        success, response = self.run_test(
            "Get Non-existent Result (should return 404)",
            "GET",
            "api/quiz/result/invalid-id-12345",
            404
        )
        return success

def main():
    print("🚀 Starting Pati Devta Quiz API Tests...")
    print("=" * 50)
    
    # Setup
    tester = QuizAPITester()
    
    # Run tests in order
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("Submit Quiz", tester.test_submit_quiz),
        ("Get All Results", tester.test_get_all_results),
        ("Get Specific Result", tester.test_specific_result),
        ("Invalid Result ID", tester.test_invalid_result_id)
    ]
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            test_func()
        except Exception as e:
            print(f"❌ Test {test_name} failed with exception: {str(e)}")
    
    # Print final results
    print(f"\n{'='*50}")
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())