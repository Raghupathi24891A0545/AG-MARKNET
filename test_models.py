import requests

API_KEY = "AIzaSyAWXjkiEuQif_W1ngEYxafYsbe4qqdRffQ"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"
response = requests.get(url)
print(response.text)
