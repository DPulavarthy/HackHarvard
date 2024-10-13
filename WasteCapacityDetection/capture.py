"""
Capture image from iphone (through Camo app)
and 
"""

import cv2
import os

save_directory = "images"


# saves a file locally that will be used in opencv3.py
def take_photo():
    # Specify the camera index (0 for the default camera, 1 for an external camera, etc.)
    camera_index = 1  # Change this to the correct index for your camera
    cap = cv2.VideoCapture(camera_index)

    # Check if the camera opened successfully
    if not cap.isOpened():
        print(f"Cannot open camera {camera_index}")
        exit()

    # Capture a single frame
    ret, frame = cap.read()

    # Check if frame was captured
    if not ret:
        print("Failed to capture image")
    else:
        # Define the cropping region (startY, endY, startX, endX)
        # Example: Cropping a 200x200 region starting from (100, 100)
        # cropped_frame = frame[400:1280, 0:720]
        cropped_frame = frame

        # Save the cropped frame as an image
        cropped_image_filename = os.path.join(save_directory, "cropped_image.jpg")
        cv2.imwrite(cropped_image_filename, cropped_frame)
        print(f"Cropped image saved as {cropped_image_filename}")

    # Release the camera and close windows
    cap.release()
    cv2.destroyAllWindows()


