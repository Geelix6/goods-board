.PHONY: build-all backend frontend

build-all:
	docker buildx bake -f docker-bake.hcl

backend:
	docker buildx bake backend

frontend:
	docker buildx bake frontend