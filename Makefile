
deploy:
	gcloud functions deploy gcbNotifier_r2 \
		--region us-central1 \
		--runtime nodejs20 \
		--gen2 \
		--trigger-topic cloud-builds \
		--memory 128MB \
		--timeout 10s \
		--env-vars-file secrets.yaml
