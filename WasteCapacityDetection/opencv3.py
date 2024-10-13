import cv2
import numpy as np
import os

save_directory = "images"
def find_water_level(image_path, lower_color_range, upper_color_range, debug):
    # Load the image
    image = cv2.imread(image_path)

    # Convert the image to HSV color space
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Create a mask using the provided water color range
    mask = cv2.inRange(hsv_image, lower_color_range, upper_color_range)

    # Find the coordinates of all the points within the water color range
    y_coords, x_coords = np.where(mask == 255)

    if len(y_coords) > 0:
        # Find the lowest y-value, which corresponds to the highest point (water level)
        # highest_y = np.min(y_coords)
        # lowest_y = np.max(y_coords)
        # height = lowest_y - highest_y

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if len(contours) > 0:
            max_contour = max(contours, key=cv2.contourArea)
            highest_y = np.min(max_contour[:, :, 1])
            lowest_y = np.max(max_contour[:, :, 1])
        height = lowest_y - highest_y


        # Optional: Draw a line at the water level on the original image
        cv2.line(image, (0, highest_y), (image.shape[1], highest_y), (0, 255, 0), 2)
        cv2.line(image, (0, lowest_y), (image.shape[1], lowest_y), (0, 255, 0), 2)


        print(f"The highest point of the water level is at y = {highest_y}")
        print(f"The lowest point of the water level is at y = {lowest_y}")
        print(lowest_y+height)
        # print(f"Height: {height}")

        percent = height / (lowest_y) * 100
        print(f"percent: {percent}% filled")

        if (debug):
            # Display the image with the water level line
            cv2.imshow('Water Level Detection', image)
            cv2.waitKey(0)
            cv2.destroyAllWindows()

        
        return percent
    else:
        print("No water detected within the specified color range.")
        return None

def get_percent_filled(debug=False):
    # # Example water color range in HSV (tune these values to match the water color)
    # lower_color_range = np.array([90, 50, 50])  # Example for blue-ish water
    # upper_color_range = np.array([130, 255, 255])

    # lower_color_range = np.array([130, 50, 30])  # Example for blue-ish water
    # upper_color_range = np.array([180, 255, 200])
    

    # lower_color_range = np.array([130, 60, 30])  # dark purple water
    # upper_color_range = np.array([180, 255, 120]) # exlucde lighg

    ### BLACK
    lower_color_range = np.array([0, 0, 0])  # dark purple water
    upper_color_range = np.array([180, 255, 50]) # exlucde lighg
    

    # Path to your image file
    image_path = os.path.join(save_directory, "cropped_image.jpg")

    # Call the function to find the water level
    return find_water_level(image_path, lower_color_range, upper_color_range, debug)
    
