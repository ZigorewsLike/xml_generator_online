
from django.urls import path
from . import views

urlpatterns = [
    path('', views.render_main_page),
    path('generator', views.gener),
    path('docs', views.docs),
    path('download<filename>/', views.downloadfile),
]