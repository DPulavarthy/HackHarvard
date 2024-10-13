# CleanSweep
<div align="center">
  <img alt="banner" src="https://github.com/user-attachments/assets/d3f997ef-7b3c-49c8-8c1c-45a2f995db83" width="200" height="200">
  
  ### Smart city waste management using real-time data
</div>

## Application Demo
[![Click Here For The Video](https://github.com/user-attachments/assets/246b14be-ca35-43c7-9157-0d859b74b019)](https://youtu.be/iU_6u-RygyQ)

## Built with:
<div align="center">
  <img alt="Alt text" src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black"/>
  <img src=https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black>
  <img src=https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=for-the-badge&logo=Tailwind-CSS&logoColor=white>
  <img src=https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white>
  <img src="https://img.shields.io/badge/Terraform-7B42BC.svg?style=for-the-badge&logo=terraform&logoColor=white" alt="Terraform">
  <img src=https://img.shields.io/badge/OpenCV-5C3EE8.svg?style=for-the-badge&logo=opencv&logoColor=white>
  <img src=https://img.shields.io/badge/Google%20Maps%20API-4285F4.svg?style=for-the-badge&logo=googlemaps&logoColor=white>
  <img src=https://img.shields.io/badge/Raspberry%20Pi-C51A4A.svg?style=for-the-badge&logo=raspberrypi&logoColor=white>
</div>



## Inspiration
We aimed to contribute to smart cities by helping garbage truck drivers receive the most efficient route in near-real-time, reducing waste buildup in prone areas. Traditional waste collection relies on static daily or weekly routes, which leads to inefficiency. By targeting areas where waste accumulates faster, we can reduce contamination, improve air quality, and create greener environments. This solution also optimizes the use of resources and reduces the strain on landfills.

## What it does
CleanSweep uses sensors that collect real-time data on trash bin levels throughout the city. This data is continuously updated on the truck drivers' main portal, allowing them to receive the most efficient routes based on real-time conditions like bin capacity, traffic, and days since the last pickup. As drivers collect trash, they update their progress live, and the system provides the next optimized route.

## How we built it
- **Hardware**: We used phone cameras to capture images of trash bins, processed the images using Python OpenCV on a Raspberry Pi to detect the trash levels, and displayed the results on a set of LEDs. The trash levels were then sent to a local server for further processing.
  
- **Backend**: We gathered trash level data, Google Maps API traffic data, and days since the last pickup, and fed this into a Random Forest Classifier on Databricks. The classifier prioritized routes to minimize emissions. An adjacency matrix was used to retrieve the highest priority paths based on waste levels and traffic.

- **Frontend**: We built a portal using React and styled it with TailwindCSS. The portal displays optimized routes based on the live data from the hardware, allowing drivers to adjust their routes dynamically. The frontend was deployed using Terraform.

## Challenges we ran into
- **Trash level detection**: Using cameras and OpenCV to measure trash levels was more difficult than expected due to lighting conditions and shadows affecting the results. We had to carefully calibrate our hardware setup and refine our contour detection algorithm.
- **API and server integration**: Connecting multiple APIs and servers toward the end of the project proved tricky as we had to ensure the system was synchronized and communicating properly across all components.

## Accomplishments we’re proud of
- **Hardware implementation**: None of us had experience with OpenCV or hardware in a hackathon setting before. We successfully integrated our skills in electrical engineering and learned how to use networks and hardware to build a complete, interactive solution.
- **Real-time optimization**: We’re proud of the dynamic routing system we created, which makes real-time optimizations based on actual data from the city, reducing the time and resources wasted on traditional static routes.

## What we learned
We learned about the importance of integrating hardware, software, and networks to solve real-world problems. Additionally, we gained experience working with OpenCV, Raspberry Pi, and creating efficient routing models using machine learning.

## What's next for CleanSweep
- **Real-time sensors**: We plan to implement real-time sensors in all bins across the city to fully automate the system, allowing garbage truck drivers to collect trash from the most filled bins first, reducing waste buildup and improving overall efficiency.
