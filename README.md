# MentionsCrawler

[Deployed Here](https://mentioncrawler.herokuapp.com/)
&nbsp;


A web app that allows marketing teams and departments of any business track the most up to date news and conversations that are taking place across different social media sites. This would aid businesses in getting a snapshot / sense of what current conversations are being held, what current sentiments are, and how news outlets and the public are perceiving your company in real-time.

Users are directed to our signup/login gate when they first navigate to our site, where they're prompted to enter in a company that they'd like to track if they're new to our site:
![alt text](https://i.imgur.com/KegYsYR.png)


&nbsp;


Once users register and login, they are greeted to our main page:
![alt text](https://i.imgur.com/LzwBycN.png)

From here, they can filter by which social media sites they want news from, by how recent or most popular the post is, and by keyword, if they only want news regarding a particular item/event. Each mention can also be favorited for reference and will be saved in a "Liked Mentions" component.


&nbsp;


Because our server is constantly checking for new mentions using a task queue and job scheduler, users may see new news items pop up if our database gets populated with new mentions on your company. Once clicked, a popup appears showing all your new mentions.:
![alt text](https://i.imgur.com/4uvDHwj.png)




&nbsp;

We also have a feature that will send you the latest updates on your company through a weekly newsletter. This newsletter will gather the top ten most popular stories through all our platforms and display it in your email, as seen here:
![alt text](https://i.imgur.com/CIlw922.png)

# EXPRESS-STARTER

## PostgreSQL setup:

Please download PostgreSQL from https://www.postgresql.org/download/, create a local database and set the value of the three variables shown below in the .env file with the corresponding database credential.

- DB_name
- DB_username
- DB_password

