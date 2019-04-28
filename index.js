
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const SlackWebhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

exports.gcbNotifier = (event, cb) => {
  const build = eventToBuildAdapter(event.data.data);
  const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
  if (status.indexOf(build.status) === -1) {
    return cb();
  }

  const message = buildSlackMessage(build);
  SlackWebhook.send(message, cb);
};

const eventToBuildAdapter = (data) => {
  return JSON.parse(Buffer.from(data, 'base64').toString());
};

const buildSlackMessage = (build) => {
  return {
    text: `Build ${build.id}`,
    mrkdwn: true,
    attachments: [
      {
        title: 'Build logs',
        title_link: build.logUrl,
        fields: [{
          title: 'Status',
          value: build.status,
        }],
      },
    ],
  };
};
