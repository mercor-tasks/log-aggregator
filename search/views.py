import json

from django.http import JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from search.client._fetch_logs import fetch_logs_from_server
from search.client._schema import SearchSchema


@method_decorator(csrf_exempt, name='dispatch')
class SearchView(View):
    def get(self, request):
        return render(
            request,
            'search.html',
            context={}
        )

    def post(self, request):
        """
        For multiple calls to log server, it must be sequential.
        """
        body = json.loads(request.body)

        _schema = SearchSchema._from_json(body)

        logs = fetch_logs_from_server(_schema)

        return JsonResponse({
            "logs": logs,
        })
