import requests
import os

url = "http://127.0.0.1:5000/upload"

base_dir = os.path.dirname(__file__)
image_path = os.path.join(base_dir, "sample.png")

files = {
    "file": open(image_path, "rb")
}

response = requests.post(url, files=files)

print(response.json())