import os

import requests

from utils.utils import read_nested_key_from_props

from ._schema import SearchSchema

LOG_SEARCH_HOST = read_nested_key_from_props("log-server.host")
LOG_SEARCH_ENDPOINT = read_nested_key_from_props("log-server.search-endpoint")


def _get_api_body(schema: SearchSchema):
    query = schema._build_query()
    return {
        'query': query,
        'startTime': schema.start_time,
        'endTime': schema.end_time,
    }


def fetch_logs_from_server(search_schema: SearchSchema):
    response = requests.request(
        "POST",
        url=os.path.join(LOG_SEARCH_HOST, LOG_SEARCH_ENDPOINT),
        data=_get_api_body(search_schema),
    )
    response_dict = response.json()
    logs = response_dict.get('logs')
    return logs
