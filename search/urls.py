from django.urls import path

from . import views

urlpatterns = [
    path('execute', views.SearchView.as_view(), name='execute_search'),
]
