#!/usr/bin/env python
# -*- coding: utf-8 -*-

from PIL import Image
import os

def get_image(filepath):
    try:
        img = Image.open(filepath)
        # if not img.valid():
        #     return None
        return img
    except Exception, e:
        # print e
        return None


for root, dirs, files in os.walk("/Users/frankiepo/Projects/file_clustering/src/images/htc_one"):
    for file in files:
        filepath = os.path.join(root, file)
        try:
            img = Image.open(filepath)
            img.thumbnail((50, 50), Image.ANTIALIAS)
            img.save("/Users/frankiepo//Projects/file_clustering/src/images/htc_one/thumbnails/thumbnail_50_50_%s" % (file))
        except Exception, e:
            print "aiaiaia", Exception
            print e
