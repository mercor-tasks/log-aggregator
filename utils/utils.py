import json

from django.conf import settings


def read_props():
    with open(settings.PROPS_FILE, 'r') as f:
        return json.loads(f.read())


def read_nested_key_from_props(nested_key: str):
    """
    Can be in the format of dot separated. e.g. `api.base.url`
    """
    key_chain = nested_key.split('.')
    value = PROPS.copy()
    for key in key_chain:
        if key in value:
            value = value[key]
        else:
            return None
    return value


PROPS = read_props()
