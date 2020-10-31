var socket = io()
var drawing = false

class GameController {
  constructor($scope) {
    this.$scope = $scope
    this.$scope.vm = this
    this.room = this.getRoomName()
    this.messages = []
    this.youAreDrawing = "You are guessing"
    socket.emit("joinRoom", this.room)

    bootbox.prompt("Enter a name", (name) => {
      socket.emit("setName", name)
      socket.emit("joined", name)
      this.newRound()
    })
    
    

    socket.on("updateCanvas", (history) => {
      background("white")
      for (var i of history) {
        line(i[0], i[1], i[2], i[3])
      }
    })

    socket.on("newMsg", (msg) => {
      this.messages.push(msg)
      this.$scope.$apply()
      var chat = document.querySelector("#chat-view")
      chat.scrollTop = chat.scrollHeight
    })

    socket.on("joined", (name) => {
      this.messages.push({ 
        name: name + " has joined the game",
        msg: ""
      })
      if (drawing) {
        socket.emit("setAns", this.ans)
      }
      this.$scope.$apply()
    })

    socket.on("setDrawer", () => {
      
      if (!drawing) {
        drawing = true
        this.drawing = drawing
        bootbox.prompt("What will you draw", (ans) => {
            
            this.ans = ans
            this.youAreDrawing = "You are drawing " + this.ans
            socket.emit("notDrawer")
            this.$scope.$apply()
            socket.emit("setAns", this.ans)
        })
      }else {
        socket.emit("setAns", this.ans)
      }
      
    })
    
    socket.on("notDrawer", () => {
      drawing = false
      this.drawing = drawing
      this.$scope.$apply()
    })

    socket.on("setAns", (ans) => {
      this.ans = ans
      console.log(ans)
    })

    socket.on("callNewRound", () => {
      if (drawing) {
        this.newRound()
      }
    })
  }

  getRoomName() {
    const params = new URLSearchParams(window.location.search)

    return params.get("room")
  }

  sendMsg() {

    if (this.msg != "") {
      if (this.msg.toLowerCase() != this.ans.toLowerCase()) {
        socket.emit("sendMsg", this.msg)
      }else if (!drawing) {
        socket.emit("correct")
      }else {
        socket.emit("sendMsg", this.msg)
      }
      this.msg = ""
    }
    
  }

  newRound() {
    socket.emit("newRound")
    if (drawing) {
      drawing = false
      this.drawing = drawing
      h = []
      this.youAreDrawing = "You are guessing"
      try {
        background("white")
        socket.emit("updateCanvas", h)
      } catch {}
      this.$scope.$apply()
    }
    
  }

  clear() {
    h = []
    background("white")
    socket.emit("updateCanvas", h)
  }
}


angular.module("app", []).controller("ctrl", GameController)