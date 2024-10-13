import os
import time
import base64
import json
import requests

# Watch for changes in the file and upload new versions
def upload_json(file_path, dbfs_path, token):
    url = 'https://2501998017529700.0.gcp.databricks.com/api/2.0/dbfs/put'
    headers = {'Authorization': f'Bearer {token}'}

    # Read the file content
    with open(file_path, 'r') as file:
        data = file.read()  # Read the JSON content as a string

    # Encode the JSON string in base64
    base64_data = base64.b64encode(data.encode('utf-8')).decode('utf-8')

    # Make the request to upload the file
    response = requests.post(
        url, headers=headers, json={"path": dbfs_path, "contents": base64_data, "overwrite": True}
    )

    if response.status_code == 200:
        print(f"File {file_path} successfully uploaded to {dbfs_path}")
    else:
        print(f"Failed to upload file. Status code: {response.status_code}, Response: {response.text}")
    
    return response.status_code

# Specify the path to the local JSON file
file_path = 'garbageCansData.json'  # Adjust the path as needed
last_modified_time = os.path.getmtime(file_path)

# while True:
#     # new_modified_time = os.path.getmtime(file_path)
#     # if new_modified_time != last_modified_time:
#     response = requests.get('http://192.168.124.69:1123/trashData')
#     print(response.json())
#     upload_json(file_path, '/FileStore/garbageCansData.json', os.getenv('DATABRICKS_TOKEN'))
#         # last_modified_time = new_modified_time
#     # else:
#     #     print("No changes detected.")
#     time.sleep(10)  # Check for updates every 10 seconds

file_path = 'garbageCansData.json'  # Specify your desired local file path here

while True:
    response = requests.get('http://192.168.124.69:1123/trashData')
    
    if response.status_code == 200:  # Check if the request was successful
        data = response.json()  # Parse the JSON response
        
        # Save the JSON data to a file
        with open(file_path, 'w') as json_file:
            json.dump(data, json_file, indent=4)  # Write the JSON data with pretty formatting
        
        print(f"Data saved to {file_path}")
        upload_json(file_path, '/FileStore/garbageCansData.json', os.getenv('DATABRICKS_TOKEN'))
        print("Sent to databricks")
    else:
        print(f"Failed to retrieve data: {response.status_code}")

    time.sleep(10)  # Check for updates every 10 seconds