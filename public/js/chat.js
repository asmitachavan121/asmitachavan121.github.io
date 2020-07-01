const socket = io()


//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormButton = $messageForm.querySelector('#button_submit')
const $messageFormInput = $messageForm.querySelector('input')
const $locationButton =  document.querySelector('#button-send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const urlTemplate = document.querySelector('#url-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
// console.log(Qs.parse((location.search)).stringify)

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true})
// console.log(username, room)

socket.emit('join', { username, room}, (Error) => {
    alert(Error)
    location.href='/'
    console.log(Error)
})

socket.on('connection', msg => {
    console.log(`received "${msg}" from server`)
})

const autoScroll = () => {

    //new msg element
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height 
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        //autoscroll
        $messages.scrollTop = $messages.scrollHeight
    }
    console.log(visibleHeight)
}
socket.on('message', (msg) => {
    console.log(msg)
    const timeFormat = "h:mm a"     //"D.MMM.ddd.YY h:m:s a"
    const html = Mustache.render(messageTemplate,{
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format(timeFormat)
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('locationMessage', locationMessage => {
    console.log(locationMessage)
    const timeFormat = "h:mm a"     //"D.MMM.ddd.YY h:m:s a"
    const html = Mustache.render(urlTemplate, {
        username: locationMessage.username,
        url: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format(timeFormat)
    })
    $messages.insertAdjacentHTML('beforeend', html)

    autoScroll()
})

socket.on('roomData', ({room, users}) => {
    console.log(room, users)

    const html = Mustache.render(sidebarTemplate, {
        room: room,
        users: users
    })

    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    const input_msg = event.target.elements.input_msg

    data = input_msg.value
    // console.log(data)

    socket.emit('sendMessage', data, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error) {
            alert(error)
            return console.log(error)
        } 
        console.log(`Message delivered!`)
    })

})

$locationButton.addEventListener('click', () => {
    $locationButton.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported from your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords)
        const locationObject = {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }
        const locatinURL = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
        socket.emit('sendLocation', locatinURL, (message) => {
            $locationButton.removeAttribute('disabled')
            console.log(message)
        })
    })
})