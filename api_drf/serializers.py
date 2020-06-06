from rest_framework import serializers
from options.models import Options, Bboxes


class OptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Options
        fields = ('filename', 'width', 'height', 'depth', 'segmented', 'keysession')


class BoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bboxes
        fields = ('classname', 'xmin', 'ymin', 'xmax', 'ymax', 'keysession')