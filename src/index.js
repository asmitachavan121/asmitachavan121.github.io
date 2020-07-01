const http = require('http')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users')


const port = process.env.PORT || 3000  
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname,'../public')
// console.log(publicDirectoryPath)

app.use(express.static(publicDirectoryPath))

//sends msg to all connected clients at once
io.on('connection', (socket) => {
    console.log('new websocket connection')
    msg = 'Welcome!!'

   

    socket.on('join',({username, room}, callback) => {
        // console.log(username, room)
        const {error, user} = addUser({id: socket.id ,username, room})
        // console.log(error, user)
        if(error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage(msg))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))

        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        // callback('')
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)) {
            return callback('profanity not allowed')
        }

        const { error, user } = getUser(socket.id) 
        console.log(error, user)
        if(error) {
            console.log(error)
            return callback(error)
        }

        // console.log(message)
        callback('')
        socket.emit('message', generateMessage('Me', message))
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username, message))
    })

    socket.on('sendLocation', (locationURL, callback) => {
        // console.log(`user location: ${latitude}\t ${longitude}`)
        // socket.emit('message', locationURL, callback)

        const { error, user } = getUser(socket.id)
        
        if(error) {
            return error
        }

        socket.emit('locationMessage',generateLocationMessage('me', locationURL))
        socket.broadcast.to(user.room).emit('locationMessage',generateLocationMessage(user.username, locationURL))
        callback('location shared successfully!')

    })

    socket.on('disconnect', () => {
        const {error, user} = removeUser(socket.id)

        // if(error) {
        //     return server.emit('message',(callback) => {
        //         callback(error)
        //     })
        // }
        if(!error) {
            io.to(user.room).emit('message',generateMessage(`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })

})
server.listen(port, () => {
    // console.log('chat app is ready')
    console.log(`Server is up and running at port ${port}`)
})
