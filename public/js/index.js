class IndexController {
  constructor($scope, $http) {
    this.$scope = $scope
    this.$http = $http
    this.$scope.vm = this
    this.games = []
    this.socket = io()
    this.socket.emit("requestGamesList")

    this.socket.on("addToGameList", (name) => {
      this.games.push(name)
      this.$scope.$apply()
    })

    this.socket.on("showGamesList", (list) => {
      this.games = list
      this.$scope.$apply()
    })
    
  }

  createGame(e) {
    e.preventDefault()
    this.socket.emit("createGame", this.name)
    this.joinName = this.name
    this.joinGame()
  }

  joinGame() {
    window.location = "/game.html?room=" + this.joinName
  }
}


angular.module("app", []).controller("ctrl", IndexController)