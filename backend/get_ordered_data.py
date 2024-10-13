import requests
import json
import base64
import time

# Define your Databricks workspace URL and API token
workspace_url = 'https://2501998017529700.0.gcp.databricks.com'  # Keep 'https://' at the start
api_token = os.getenv('DATABRICKS_TOKEN')  # Replace with your actual API token

# Specify the path to the JSON file in DBFS
dbfs_file_path = '/FileStore/orderedGarbageCansData.json'

# Function to read data from the specified JSON file in DBFS using Databricks API
def read_json(file_path):
    url = f"{workspace_url}/api/2.0/dbfs/read"  # The URL for reading files in DBFS
    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': 'application/json'
    }
    
    # Define the body with the path
    data = {"path": file_path}
    
    # Make the GET request to read the file
    response = requests.get(url, headers=headers, params=data)

    if response.status_code == 200:
        # Decode the base64 content and load the JSON data
        file_content = response.json()['data']  # Get the base64-encoded content
        json_data = json.loads(base64.b64decode(file_content).decode('utf-8'))  # Decode and load as JSON
        return json_data
    else:
        raise Exception(f"Failed to read file: {response.status_code} - {response.text}")

# Monitor the file continuously
local_file_path = 'orderedGarbageCansData.json'
while True:
    try:
        # Read data from the JSON file
        data = read_json(dbfs_file_path)
        print(f"Updated data retrieved from {dbfs_file_path}:")
        print(json.dumps(data, indent=4))  # Print the JSON data with pretty formatting
        
        # save json here
        # Save the data locally
        with open(local_file_path, 'w') as local_json_file:
            json.dump(data, local_json_file, indent=4)  # Write JSON data with pretty formatting
        print(f"Data saved locally to {local_file_path}")
        
    except Exception as e:
        print(f"An error occurred: {e}")

    time.sleep(10)  # Check for updates every 10 seconds
