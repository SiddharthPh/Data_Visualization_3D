# XYMA_GIT
## Project Description.
This repo's focus is on visualising data on 3-D models, which shall be rendered on web browsers.
In this project, we have used data from a temperature sensor, and color coded the 3-D model.
## Pre Requisites:
Make a 3-D model that renders a glb or gltf extension file. I have used Blender to generate the model as per requirements.
Instructions to make the model is mentioned below.
### 3-D model.
Make a appropriate model suiting your project.
![image](https://github.com/SiddharthPh/Xyma_Git/blob/master/images/Screenshot%20from%202021-07-31%2009-33-46.png)
**FILE->EXPORT->GLB/GLTF**.
Save the file in the project folder.
## Run the code.
### Activate the django virtual environment.
#### In any Linux Distro
Navigate to the project folder.
Run the following command on the terminal to activate django virtual-env.
<code>source xyma/bin/activate</code>
### Run the django server
Run the following code on the terminal to start the server.
<code> python3 manage.py runserver </code>
Open <code>http://127.0.0.1:8000 </code> on the web browser
This image should open on the browser.
![image](https://github.com/SiddharthPh/Xyma_Git/blob/master/images/Screenshot%20from%202021-06-25%2000-12-35.png)
And a 3-D model with live color coding as shown.
![image](https://github.com/SiddharthPh/Xyma_Git/blob/master/images/Screenshot%20from%202021-07-31%2011-41-17.png)

