#Text_Whisperer Backend

I implemented this backend using Node.js and Express. I used Render to deploy my backend, it is live at https://text-whisperer-backend.onrender.com 

It is mainly used for communication with the frontend, but also shows your chat history from the "/chat_output" path.

The "/selected_text" path allows you to see the text you selected (this was more for debugging purposes).

So the available paths are 
1) /
2) /chat_output
3) /selected_text



## If you wish to run the backend locally or if the link is not working:

1) Download the repository as a zip file.
2) Unzip the file and open a terminal at that location.
4) Run "npm start".
5) This will start the backend, which the frontend will automatically connect to. You can access the backend locally at http://localhost:5000
