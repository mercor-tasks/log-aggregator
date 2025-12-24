This is a log aggregator service. We have a log server where we can query raw logs based on provided parameters. This application provides an UI to show the logs from the log server and overcome some issues the log server has.

#### Following is the contract for the log server for fetching logs. The host url and endpoint are not mentioned as sensitive details.

Request Method: POST

Request Body:

```json
{
  "query": "<query>",
  "startTime": "START_TIME_IN_MILLIS",
  "endTime": "END_TIME_IN_MILLIS"
}
```

Successful Response:

```json
{
    "logs": [
        {
            "ts": "TIMESTAMP_MILLIS",
            "logLine": "logLine",
        },
        {
            ...
        },
        ...
    ]
}
```

The response logs are ordered in the ascending order of timestamp.

---

Here we're trying to overcome following problems of the existing log server. This service completely relies on the existing log server to get the data.

- The log server doesn't provide any UI, and only provides the API to query data. So we're building an UI to show the requested logs in the browser.
- The log server only provides maximum 1 days of logs in a query, even if the time range provided is more than 1 day. It clips the one day from the endTime. e.g. If I request logs from 15th Dec, 2025, 00:00:00.000 to 17th Dec, 2025, 00:00:00.000, it'll only give me logs from 16th Dec, 2025, 00:00:00.001 to 17th Dec, 2025, 00:00:00.000. We need to solve this problem by aggregating the data when searched for wider range and show it to UI. However, you can query for any time range as long as the startTime and endTime different is less than or equal to 1 day.
- This service must support log search in range upto 15 days.
