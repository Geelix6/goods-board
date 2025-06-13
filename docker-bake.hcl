target "backend" {
  context = "./backend"
  tags = ["geelix6/googs-board-backend:latest"]
}

target "frontend" {
  context = "./frontend"
  tags = ["geelix6/googs-board-frontend:latest"]
}