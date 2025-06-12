target "backend" {
  context = "./backend"
  tags = ["geelix6/googs-board-backend2:latest"]
}

target "frontend" {
  context = "./frontend"
  tags = ["geelix6/googs-board-frontend:latest"]
}