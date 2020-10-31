var h;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  h = []
}

function mouseDragged() {
  if (drawing) {
    noFill()
    line(mouseX, mouseY, pmouseX, pmouseY)
    h.push([mouseX, mouseY, pmouseX, pmouseY])
  }
}

function mouseReleased() {
  if (drawing) {
    socket.emit("updateCanvas", h)
  }
}