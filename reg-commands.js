require("dotenv/config")
const { REST } = require('@discordjs/rest');
const { Routes, ApplicationCommandOptionType } = require ('discord.js');

const commands = [
    {
        name: 'check',
        description: 'Проверяет роли за ивенты',
        options: [
            {
                name: 'user1',
                description: 'пoльзoвaтeль1, роли которого нужно проверить',
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
    {
        name: 'up-champ',
        description: 'Adding next Champion',
        options: [
            {
                name: 'user',
                description: 'user who will get new champion',
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
    {
        name: 'list',
        description: 'List of event roles and how much people own each of them'
    },
    {
        name: 'temprole',
        description: 'Adding temporary role to one or more users',
        options: [
            {
                name: 'role',
                description: 'role to add',
                type: ApplicationCommandOptionType.Role,
                required: true,
            },
            {
                name: 'user1',
                description: 'user who will get role',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'user2',
                description: 'user who will get role',
                type: ApplicationCommandOptionType.User,
                required: false,
            },
            {
                name: 'user3',
                description: 'user who will get role',
                type: ApplicationCommandOptionType.User,
                required: false,
            },
            {
                name: 'user4',
                description: 'user who will get role',
                type: ApplicationCommandOptionType.User,
                required: false,
            },
            {
                name: 'user5',
                description: 'user who will get role',
                type: ApplicationCommandOptionType.User,
                required: false,
            },
        ]
    },
    {
        name: 'event',
        description: 'Registration for the event',
        options: [
            {
                name: 'description',
                description: 'Description of your event. Main text',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'social-club-nickname',
                description: 'Social Club nickname for profile link',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'need-embed',
                description: 'Description of your event. Main text',
                type: ApplicationCommandOptionType.Boolean,
                required: true,
            }
        ]
    },
    {
        name: 'eventlist',
        description: 'Проверяет роли за ивенты',
    },
    {
        name: 'temproleslist',
        description: 'list of current added temporary roles'
    },
    {
        name: 'ping',
        description: 'tells how much time took to respond'
    },
    {
        name: 'editmessage',
        description: 'tells how much time took to respond',
        options: [
            {
                name: 'link',
                description: 'message link',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'newmessage',
                description: 'new message',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ],
    }
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('registering slash commands')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )
        console.log('slash commands registered successfully')
    } catch (error) {
        console.log(error)
    }
})();