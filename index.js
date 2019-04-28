
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const SlackWebhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

exports.gcbNotifier = (event, ctx, cb) => {
  const build = eventToBuildAdapter(event.data);
  const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
  if (status.indexOf(build.status) === -1) {
    console.log('%s(%s): invalid status %s',
        ctx.eventType, ctx.eventId, build.status);
    return cb();
  }

  console.log('%s(%s): processing', ctx.eventType, ctx.eventId);
  const message = buildSlackMessage(build);
  return SlackWebhook.send(message);
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
