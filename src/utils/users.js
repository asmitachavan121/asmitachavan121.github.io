const users = []

//addUser, deleteUser, getUser, Display Users


//addUser

const addUser = ({id, username, room}) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // console.log(username, room)

    if(!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }
    const IsUserExist = users.find((usr) => {
        return usr.username === username && usr.room === room
    } )

    // console.log(`isUserExist = ${IsUserExist}`)
    if(IsUserExist) {
        return {
            error: 'Username already exists!'
        }
    }

    const user = {id, username, room}
    users.push(user)
    return { user  }
}

//removeUser
const removeUser = (id) => {
    if(!id) {
        return ({
            error: 'id required'
        })
    }
    const index = users.findIndex((usr) => {
        return usr.id == id
    }) 

    if(index === -1) {
        return {
            error: "user does not exist!"
        }
    }

    return { user: users.splice(index, 1)[0] }
}

// getUser
const getUser = (id) => {
    if(!id) {
        return {
            error: 'provide user id'
        }
    }

    const user = users.find(usr => usr.id === id)
    return { user }
}

//getUsersInRoom
const getUsersInRoom = (room) => {
    if(!room) {
        return {
            error: 'provide room name'
        }
    }
    room = room.trim().toLowerCase()

    return users.filter((usr) => usr.room == room)
}

// addUser({
//     id: 1,
//     username: 'Ameya',
//     room: 'chat'
// })
// const {error, user} = addUser({
//     id: 2,
//     username: 'Radhika',
//     room: 'chat'
// })
// console.log(error, user)

// const {error, user} = removeUser(1)
// console.log(error,user)
module.exports = { 
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}