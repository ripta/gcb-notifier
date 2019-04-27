
`gcb-notifier` is the [Google-provided Slack connector][gcb-tpn] for Google
Cloud Build notifications potentially with some modifications to suit my own
needs. You likely want the reference implementation.

[gcb-tpn]: https://cloud.google.com/cloud-build/docs/configure-third-party-notifications


To install this function, it is assumed that `gcloud` CLI is set up and that
the default project is active.

1. Clone this repository locally.

2. Go to [custom integrations][slack-integ] on your workspace and create a new
   incoming webhook. This will be the `[URL]` below.

3. Create a new `secrets.yaml` file in the current directory containing:

```
SLACK_WEBHOOK_URL: '[URL]'
```

4. Run `make deploy`.

[slack-integ]: https://slack.com/apps/manage/custom-integrations

