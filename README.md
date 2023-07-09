
# Jane

Jane is a modular Discord bot **self-hosted**, focused on assisting with moderation and providing fun features for users. It is designed to be versatile and user-friendly, offering various utility functions. Currently, most of the implemented features revolve around general utility, such as displaying someone's avatar photo or banner.

The bot also integrates with the League of Legends API, allowing users to retrieve statistics based on their summoner name. Additionally, a package tracking module is being developed, specifically targeting shipments within Brazil.

For moderation purposes, there is currently a command available to clear chat messages, but there are plans to expand the moderation features extensively.
## Environment Variables

To run the project, you need to define the following environment variables in the .env file:

- `BOT_TOKEN`: Your Discord bot token.
- `DATABASE_URL`: URL of your MongoDB database.
- `RIOT_API_KEY`: Your Riot API key.


## Getting Started

To get started with Jane Bot, follow these steps:

1. Clone the repository: `https://github.com/VoidGS/jane.git`
2. Install the dependencies: `npm install`
3. Set up the required environment variables as mentioned in the previous section.
4. Run the bot: `npm start`

```bash
  git clone https://github.com/VoidGS/jane.git
  cd jane
  npm install
  npm run start
```
    
## Features

- **Avatar and Banner Display**: The bot can retrieve and display the avatar and banner images of Discord users.
- **League of Legends Integration**: Users can search for and retrieve statistics based on their summoner name in the game League of Legends.
- **Package Tracking (Brazil)**: A module is being implemented to track shipments within Brazil. Users will be able to obtain information about their packages.
- **Message Clearing**: A moderation command is available to clear chat messages, allowing for a cleaner chat environment.

