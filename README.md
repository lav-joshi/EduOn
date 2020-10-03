# Education Portal
EduOn based on **Node.js**  with custom **SuperUser , Student and Teacher Dashboard** .
## Instructions for Setup:
1. Download the zip file and extract it to a New Folder.
2. Open terminal and navigate to the folder.
  ### Setting Up Server:
   * Make the folder config inside the new folder and the file **keys.js** inside it.
   * Use **MongoDB** as the database for this project.
   * Make file **keys.js** like this: ![key.js](https://user-images.githubusercontent.com/54629424/79287275-e9e38e80-7ee0-11ea-8041-9f8dd3ab330f.png)

 #### Enabling Login with Google:
  `A guide about this can be found here`: [Simple guide to get clientID and clientSecret.](https://developers.google.com/adwords/api/docs/guides/authentication)
   * Put these keys in **keys.js**.
1. Download all the dependencies which are in **package.json** using command **npm install** .
1. Run the command **npm run dev** to start the project.

**This is our Home Page :-**
![Screenshot (54)](https://user-images.githubusercontent.com/54629424/92310556-5153c500-efcd-11ea-9035-d742d1f4b4a7.png)

This project is for a particular organization , add the **superuser** for the same in the database collection named superusers **(field name : name & email)** and then you can login from that account and then add teachers and students from the superuser dashboard . 
After adding teachers and students you can explore all the functionalities of all dashboards.

Hope you had setup the project locally . Functionalities are described in the DevFolio Submission.

Find the **super_user** in config file . Feel free to add students and teachers from superuser .

`Presentation Link :- `: [Click here](https://docs.google.com/presentation/d/15WAub5ldWeMs-Hjag1PWxJh1dwYY41rhazj-YsyKDtg/edit?usp=sharing)

`Using PeerJs from this domain :- `: [Click here](https://github.com/harshitg00/peerjs_EduOn)

`DevFolio Submission Link :- `: [Click here](https://devfolio.co/submissions/EduOn)
## Thank You !!!!

