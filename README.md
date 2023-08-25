# User Posts And Comments

User Posts And Comments provides us the ability to create & retrieve users, create posts for a user and retrieve posts of a user,

1. `POST /v1/login` - accepts a email and password which is compulsory.
2. `POST /v1/users` - accepts a email, password & name used to create a user account
3. `GET /v1/users` - Used to fetch all created users
4. `POST /v1/users/:id/posts` - used to create a post for a user, it accepts only title field and user id in the params
5. `GET /v1/users/:id/posts` - Get all posts by a user

The table below describes the request and response of the two endpoints:

| Endpoint       | Request                                                | Success Response                                                                                                                                                                                                                                                                                                                                           |
| -------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST /v1/login | { "email": "gear6@gmail.com", "password": "hashpitS" } | { "data": { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsIm5hbWUiOiJnZWFyNSIsImlhdCI6MTY5Mjk1MjI4MSwiZXhwIjoxNjkzMDM4NjgxfQ.8_SRthf5Eh-EiANocIW6IA4zsJTjEEwurQH91-1qx6c", "userData": { "id": 14, "name": "gear5", "email": "gear6@gmail.com", "createdat": "2023-08-25T07:31:16.201Z" } }, "message": "Login successful", "success": true } |

# How to run User Posts And Comments API

1. Clone the Github repository
2. `yarn install`
3. Create a `.env` file and add the environment variables found in `.env.example`
4. Run the API using the following command: `yarn run dev`
5. To run tests, run the following command: `yarn test`
