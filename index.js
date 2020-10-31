const express = require('express')
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)
const port = 3000
var gamesList = []

function setRoom(socket) {
  var rooms = Object.keys(socket.rooms)
  var sendTo = ""

  for (var room of rooms) {
    if (room != socket.id) {
      sendTo = room
      break
    }
  }
  socket.room = sendTo
}

io.on("connection", function(socket) {
  socket.on("createGame", function(name) {
    gamesList.push(name)
    io.emit("addToGameList", name)
  })

  socket.on("requestGamesList", function() {
    socket.emit("showGamesList", gamesList.slice(0, 100))
  })

  socket.on("joinRoom", function(room) {
    socket.join(room)
  })

  socket.on("updateCanvas", function(history) {
    if (!socket.room) {
      setRoom(socket)
    }

    socket.to(socket.room).emit("updateCanvas", history)
  })

  socket.on("sendMsg", function(msg) {
    if (!socket.room) {
      setRoom(socket)
    }

    io.to(socket.room).emit("newMsg", {
      name: socket.name,
      message: msg
    })
  })

  socket.on("setName", function(name) {
    socket.name = name

  })

  socket.on("joined", function(name) {
    if (!socket.room) {
      setRoom(socket)
    }

    io.to(socket.room).emit("joined", name)
  }) 

  socket.on("newRound", function() {
    var room = io.sockets.adapter.rooms[socket.room]
    var keys = Object.keys(room.sockets)
    console.log(room)
    if (room.length == 1) {
      room.drawIdx = 0
    }else if (socket.id == keys[room.drawIdx]) {
      room.drawIdx++
      room.drawIdx = room.drawIdx % keys.length
    }

    room.corrects = 0
    io.to(keys[room.drawIdx]).emit("setDrawer")
  })

  socket.on("notDrawer", function() {
    if (!socket.room) {
      setRoom(socket)
    }

    socket.to(socket.room).emit("notDrawer")
  })

  socket.on("setAns", function(ans) {
    socket.to(socket.room).emit("setAns", ans)
  })

  socket.on("correct", function() {
    io.to(socket.room).emit("newMsg", {
      name: `${socket.name} has answered correctly`,
      message: ""
    })
    var room = io.sockets.adapter.rooms[socket.room]
    room.corrects++

    if (room.corrects == room.length - 1) {
      io.to(socket.room).emit("callNewRound")
    }
  })
})

app.use(express.static(__dirname + "/public"))

http.listen(port, function() {
  console.log("Running")
})