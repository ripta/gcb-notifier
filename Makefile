
deploy:
	gcloud functions deploy gcbNotifier --runtime nodejs10 --trigger-topic cloud-builds --memory 128MB --timeout 10s --env-vars-file secrets.yaml
