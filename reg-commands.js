require("dotenv/config")
const { REST } = require('@discordjs/rest');
const { Routes, ApplicationCommandOptionType } = require ('discord.js');

const commands = [
    {
        name: 'test',
        description: 'test',
        options: [
            {
                name: 'user',
                description: 'user',
                type: ApplicationCommandOptionType.User,
                required: false,
            }
        ]
    },
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
        name: 'upchamp',
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
        description: 'adding temporary role to one or more users',
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
    },
    {
        name: 'news',
        description: 'remakes news message',
        options: [
            {
                name: 'messageid',
                description: 'id of the message which contains original news',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ],
    },
    {
        name: 'say',
        description: 'says the message u typed',
        options: [
            {
                name: 'message',
                description: 'message that bot will send',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'reply',
                description: 'message to which bot will reply',
                type: ApplicationCommandOptionType.String,
                required: false,
            }
        ],
    },
    {
        name: 'removerole',
        description: 'remove role you\'ve given incorrectly',
        options: [
            {
                name: 'role',
                description: 'Role which was given incorrectly',
                type: ApplicationCommandOptionType.Role,
                required: true,
            },
            {
                name: 'user',
                description: 'User who got wrong role',
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
    {
        name: 'addexp',
        description: 'helps counting exp to give for winning',
        options: [
            {
                name: 'user',
                description: 'user',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'amount',
                description: 'amount of exp',
                type: ApplicationCommandOptionType.Integer,
                choices: [
                    {
                        name: 10000,
                        value: 10000
                    },
                    {
                        name: 5000,
                        value: 5000
                    }
                ],
                required: true,
            },
            {
                name: 'isnewsession',
                description: 'Is it new session of counting exp?',
                type: ApplicationCommandOptionType.Boolean,
                choices: [
                    {
                        name: 'yes',
                        value: true
                    }
                ], 
                required: false, 
            }
        ]
    },
    {
        name: 'clearcountinglist',
        description: 'clears counting list'
    },
    {
        name: 'eventgtapc',
        description: 'gives or removes all needed roles for an eventer',
        options: [
            {
                name: 'user',
                description: 'user',
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
    {
        name: 'cleanracer',
        description: 'gives clean racer role',
        options: [
            {
                name: 'user',
                description: 'user',
                type: ApplicationCommandOptionType.User,
                required: true,
            }
        ]
    },
    {
        name: 'eventban',
        description: 'gives event ban role for specific time or permanently if time is not given',
        options: [
            {
                name: 'user',
                description: 'user',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'time',
                description: '1 year or permanent',
                type: ApplicationCommandOptionType.Integer,
                choices: [
                    {
                        name: '1 year',
                        value: 1
                    },
                    {
                        name: 'permanent',
                        value: 0
                    }
                ],
                required: true,
            }
        ]
    },
    {
        name: 'createunbitem',
        description: 'creates all unbeliava commands to create emoji item',
        options: [
            {
                name: 'name',
                description: 'name of the item',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'emoji',
                description: 'name of the role',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'price',
                description: 'price of the item',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            }
        ]
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