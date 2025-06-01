include make.vars

DOCKER_BUILD = docker build --no-cache
DOCKERFILE_PATHWAYS = $(MONOREPO_ROOT)/apps/pathways/Dockerfile

image-staging:
	$(DOCKER_BUILD) --build-arg NEXT_PUBLIC_API_URL=$(API_URL_STAGING) --file $(DOCKERFILE_PATHWAYS) --tag $(REPOSITORY)/$(IMAGE_NAME_STAGING):$(IMAGE_VERSION_STAGING) $(MONOREPO_ROOT)

tag-staging: image-staging
	docker tag $(REPOSITORY)/$(IMAGE_NAME_STAGING):$(IMAGE_VERSION_STAGING) $(AWS_ECR_URL)/$(REPOSITORY)/$(IMAGE_NAME_STAGING):$(IMAGE_VERSION_STAGING)

push-staging: tag-staging
	docker push $(AWS_ECR_URL)/$(REPOSITORY)/$(IMAGE_NAME_STAGING):$(IMAGE_VERSION_STAGING)

deploy-staging: image-staging tag-staging push-staging

image-dev:
	$(DOCKER_BUILD) --build-arg NEXT_PUBLIC_API_URL=$(API_URL_DEV) --file $(DOCKERFILE_PATHWAYS) --tag $(REPOSITORY)/$(IMAGE_NAME_DEV):$(IMAGE_VERSION_DEV) .