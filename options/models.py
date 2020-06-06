from django.db import models


class Options(models.Model):
    keysession = models.TextField(max_length=200)
    filename = models.TextField(max_length=100)
    width = models.IntegerField()
    height = models.IntegerField()
    depth = models.IntegerField()
    segmented = models.IntegerField()


class Bboxes(models.Model):
    keysession = models.TextField(max_length=200)
    classname = models.TextField(max_length=100)
    xmin = models.IntegerField()
    xmax = models.IntegerField()
    ymin = models.IntegerField()
    ymax = models.IntegerField()
