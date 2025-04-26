import requests

BASE_URL = "http://127.0.0.1:5000"

# Step 1: Register
register_data = {
    "Username": "john_doe",
    "Password": "secret123",
    "Email": "john@example.com"
}

register_response = requests.post(f"{BASE_URL}/api/register", json=register_data)
print("Register:", register_response.status_code, register_response.json())

# Step 2: Login
login_data = {
    "Username": "john_doe",
    "Password": "secret123"
}

login_response = requests.post(f"{BASE_URL}/api/login", json=login_data)
print("Login:", login_response.status_code, login_response.json())

if login_response.status_code == 200:
    access_token = login_response.json()["access_token"]

    # Step 3: Access profile
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    profile_response = requests.get(f"{BASE_URL}/api/profile", headers=headers)
    print("Profile:", profile_response.status_code, profile_response.json())
else:
    print("Login failed. Skipping profile check.")
