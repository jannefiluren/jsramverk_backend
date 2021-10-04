## How to use this editor backend

After downloading this code, run `npm install` to get required dependencies.

Create a user account for Mongodb+Atlas and setup an editor database there. Create a `config.json` file in the root directory of this repository with the following content:

```
{
    "username": "xxx",
    "password": "xxx"
}
```

Finally, start the application by running `npm run start`.

## Separation of routes

The routes of this API are currently part of the `app.js` file without any clear logical separation...
