from django.shortcuts import render
from rest_framework import viewsets
from options.models import Options, Bboxes
from .serializers import OptSerializer, BoxSerializer


class OptViewSet(viewsets.ModelViewSet):
    queryset = Options.objects.all()
    serializer_class = OptSerializer


class BoxViewSet(viewsets.ModelViewSet):
    queryset = Bboxes.objects.all()
    serializer_class = BoxSerializer
