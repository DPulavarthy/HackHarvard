import pandas as pd
import json
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# Load data from JSON
with open('garbageCansData.json') as f:
    data = json.load(f)

# Convert to DataFrame
df = pd.DataFrame(data)

# Convert fill levels and days since last picked to numeric
df['fill_level'] = df['fill_level'].astype(int)
df['days_since_last_picked'] = df['days_since_last_picked'].astype(int)

# Create a binary target variable: 
# Set to 1 if fill_level >= 3 or days_since_last_picked >= 5, else 0
df['priority'] = ((df['fill_level'] >= 3) | (df['days_since_last_picked'] >= 5)).astype(int)

# Adjust priority logic to exclude fill_level 0 from being prioritized
# Set priority to 0 for fill_level 0 locations if there are others available
for index, row in df.iterrows():
    if row['fill_level'] == 0 and any(df['fill_level'] > 0):
        df.at[index, 'priority'] = 0

# Prepare features and target variable
X = df[['fill_level', 'days_since_last_picked']]
y = df['priority']

# Feature Scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Create and train a Random Forest Classifier
model = RandomForestClassifier(random_state=42, max_depth=5, min_samples_split=3)
model.fit(X_train, y_train)

# Use the model to predict priorities on the full dataset
df['predicted_priority'] = model.predict(X_scaled)

# Filter the DataFrame based on predicted priority
prioritized_df = df[df['predicted_priority'] == 1]

# Check if there are multiple prioritized dumpsters
if prioritized_df.empty:
    print("No prioritized dumpsters found.")
# else:
    # print("Prioritized dumpsters found:")
    # print(prioritized_df[['id', 'location', 'fill_level', 'days_since_last_picked']])

# Create a distance matrix based on durations for prioritized locations
num_prioritized = len(prioritized_df)
prioritized_ids = prioritized_df['id'].values.tolist()

# Create a reduced distance matrix for only prioritized locations
duration_matrix = np.zeros((num_prioritized, num_prioritized))

for i in range(num_prioritized):
    for j in range(num_prioritized):
        original_index_i = prioritized_ids[i] - 1  # Adjust for zero-based index
        original_index_j = prioritized_ids[j] - 1  # Adjust for zero-based index
        duration_matrix[i][j] = int(df.iloc[original_index_i]['durations'][original_index_j].split()[0])

# Nearest Neighbor Approach to visit all prioritized dumpsters
def nearest_neighbor(start_index, duration_matrix):
    num_nodes = len(duration_matrix)
    visited = [False] * num_nodes
    route = []
    current_node = start_index

    for _ in range(num_nodes):
        route.append(prioritized_ids[current_node])  # Record the ID
        visited[current_node] = True
        next_node = None
        next_duration = float('inf')

        # Find the nearest unvisited node
        for neighbor in range(num_nodes):
            if not visited[neighbor] and duration_matrix[current_node][neighbor] < next_duration:
                next_duration = duration_matrix[current_node][neighbor]
                next_node = neighbor

        if next_node is None:  # No more unvisited nodes
            break

        current_node = next_node

    return route

# Start from the first prioritized location
start_index = 0  # Using zero-based index for the matrix
optimized_route = nearest_neighbor(start_index, duration_matrix)


new_data = {
    "trashData": data,
    "route": optimized_route
}

with open('orderedGarbageCansData.json', 'w') as f:
    json.dump(new_data, f, indent=4)
