from django.shortcuts import render
from .models import Options, Bboxes
from xml.etree.ElementTree import ElementTree
import xml.etree.ElementTree as ET
from django.http import HttpResponse
import os


def delete_exc_char(text):
    for ch in ['.jpg', '.jpeg', '.bmp', '.png', '.ico', '.gif', '.eps']:
        if ch in text:
            text = text.replace(ch, "")
    return text


def render_main_page(request):
    return render(request, 'index.html')


def docs(request):
    return render(request, 'docs.html')


def gener(request):
    qqueryset = Options.objects.all()
    if len(qqueryset) > 1:
        return render(request, 'generator.html', {'qqueryset': qqueryset[0]})
    else:
        return render(request, 'generator.html')


def downloadfile(request, filename):
    qqueryset1 = Options.objects.filter(keysession=filename).first()
    with open('files/'+str(delete_exc_char(qqueryset1.filename))+'.xml', 'w') as f:
        qqueryset2 = Bboxes.objects.filter(keysession=filename)
        rootTree = ET.Element('annotation')
        fn = ET.SubElement(rootTree, "filename")
        fn.text = qqueryset1.filename
        size = ET.SubElement(rootTree, "size")
        width = ET.SubElement(size, "width")
        width.text = str(qqueryset1.width)
        height = ET.SubElement(size, "height")
        height.text = str(qqueryset1.height)
        depth = ET.SubElement(size, "depth")
        depth.text = str(qqueryset1.depth)
        segmented = ET.SubElement(rootTree, "segmented")
        segmented.text = str(qqueryset1.segmented)
        for qquery in qqueryset2:
            object = ET.SubElement(rootTree, "object")
            name = ET.SubElement(object, "name")
            name.text = str(qquery.classname)
            bndbox = ET.SubElement(object, "bndbox")
            xmin = ET.SubElement(bndbox, "xmin")
            xmin.text = str(qquery.xmin)
            ymin = ET.SubElement(bndbox, "ymin")
            ymin.text = str(qquery.ymin)
            xmax = ET.SubElement(bndbox, "xmax")
            xmax.text = str(qquery.xmax)
            ymax = ET.SubElement(bndbox, "ymax")
            ymax.text = str(qquery.ymax)

        ElementTree(rootTree).write(f, encoding='unicode')
    with open('files/' + str(delete_exc_char(qqueryset1.filename)) + '.xml', 'rb') as f:
        response = HttpResponse(f.read(), content_type="application/vnd.ms-excel")
        response['Content-Disposition'] = 'inline; filename=' + os.path.basename(delete_exc_char(qqueryset1.filename) + '.xml')
    Bboxes.objects.filter(keysession=filename).delete()
    Options.objects.filter(keysession=filename).delete()

    return response