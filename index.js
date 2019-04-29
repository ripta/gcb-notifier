
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const SlackWebhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

exports.gcbNotifier = async (event, ctx, cb) => {
  const build = eventToBuildAdapter(event.data);
  const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
  if (status.indexOf(build.status) === -1) {
    console.log('%s(%s): ignoring status %s',
        ctx.eventType, ctx.eventId, build.status);
    return cb();
  }

  try {
    const message = buildSlackMessage(build);
    const result = await SlackWebhook.send(message);
    console.log('%s(%s): processed: %s',
        ctx.eventType, ctx.eventId, result.body);
  } catch (err) {
    console.log('%s(%s): error: %s', ctx.eventType, ctx.eventId, err);
  }
  return cb();
};

const eventToBuildAdapter = (data) => {
  const raw = Buffer.from(data, 'base64').toString();
  console.log(raw);
  return JSON.parse(raw);
};

const buildSlackMessage = (build) => {
  return {
    text: `${build.substitutions.REPO_NAME} — build ${build.id}`,
    mrkdwn: true,
    attachments: [
      {
        title: 'Build logs',
        title_link: build.logUrl,
        fields: [
          {
            title: 'Status',
            value: build.status,
          },
          {
            title: 'Repository',
            value: build.substitutions.REPO_NAME,
          },
          {
            title: 'Commit',
            value: build.substitutions.COMMIT_SHA,
          },
          {
            title: 'Branch',
            value: build.substitutions.BRANCH_NAME,
          },
        ],
      },
    ],
  };
};
