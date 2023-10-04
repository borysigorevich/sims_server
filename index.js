const {Server} = require('socket.io')

const io = new Server(3000, {
    cors: 'https://sims-eight.vercel.app/'
})

const characters = []

const generateRandomPosition = () => {
    return [Math.random() * 3, 0, Math.random() * 3]
}

const generateRandomHexColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

io.on('connection', socket => {
    console.log('connected')

    characters.push({
        id: socket.id,
        position: generateRandomPosition(),
        bodyColor: generateRandomHexColor(),
        headColor: generateRandomHexColor(),
        feetColor: generateRandomHexColor(),
    })

    socket.emit('hello', 'message')

    socket.on('move', (position) => {
        const character = characters.find(character => character.id === socket.id)
        character.position = position
        io.emit('characters', characters)
    })

    io.emit('characters', characters)

    socket.on('disconnect', () => {
        console.log('disconnected')

        characters.splice(
            characters.findIndex(character => character.id === socket.id),
            1
        )
        io.emit('characters', characters)
    })
})