#!/usr/local/bin/python
# -*- coding: UTF-8 -*-

import json
import os
import pytz, datetime
import io
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from clarifai.rest import ClarifaiApp

client_id = "28c115mfoLfciPM973D-sJTCKlUcoVF7GmnAoSWd"
client_secret = "-ZOZuUVzCwdfaciC1kPy9ydKwNmK0mlCv0mprO0r"
app = ClarifaiApp(client_id, client_secret)

# get the general model
model = app.models.get("general-v1.3")

# predict with the model


FILES = []

cl = model.predict_by_filename("/Users/frankiepo/Projects/file_clustering/src/images/htc_one/2013-07-14 19.00.44.jpg", lang="ru")
tag_list = map(lambda item: item['name'], cl['outputs'][0]['data']['concepts'])


def get_tags(filename):
    cl = model.predict_by_filename(filename, lang="ru")
    return map(lambda item: item['name'], cl['outputs'][0]['data']['concepts'])

def get_exif_data(image):
    """Returns a dictionary from the exif data of an PIL Image item. Also converts the GPS Tags"""
    exif_data = {}
    try:
        info = image._getexif()
    except:
        return None
    if info:
        for tag, value in info.items():
            decoded = TAGS.get(tag, tag)
            if decoded == "GPSInfo":
                gps_data = {}
                for gps_tag in value:
                    sub_decoded = GPSTAGS.get(gps_tag, gps_tag)
                    gps_data[sub_decoded] = value[gps_tag]
                exif_data[decoded] = gps_data
            else:
                exif_data[decoded] = value
    return exif_data

def _convert_to_degress(value):
    """Helper function to convert the GPS coordinates stored in the EXIF to degress in float format"""
    deg_num, deg_denom = value[0]
    d = float(deg_num) / float(deg_denom)

    min_num, min_denom = value[1]
    m = float(min_num) / float(min_denom)

    sec_num, sec_denom = value[2]
    s = float(sec_num) / float(sec_denom)

    return d + (m / 60.0) + (s / 3600.0)

def get_lat_lon(exif_data):
    """Returns the latitude and longitude, if available, from the
    provided exif_data (obtained through get_exif_data above)"""
    lat = None
    lon = None
    try:
        if not "GPSInfo" in exif_data:
            return None
        gps_info = exif_data["GPSInfo"]
        gps_latitude = gps_info.get("GPSLatitude")
        gps_latitude_ref = gps_info.get('GPSLatitudeRef')
        gps_longitude = gps_info.get('GPSLongitude')
        gps_longitude_ref = gps_info.get('GPSLongitudeRef')
        if gps_latitude and gps_latitude_ref and gps_longitude and gps_longitude_ref:
            lat = _convert_to_degress(gps_latitude)
            if gps_latitude_ref != "N":
                lat *= -1
            lon = _convert_to_degress(gps_longitude)
            if gps_longitude_ref != "E":
                lon *= -1
    except:
        return None
    if lat is None or lon is None:
        return None
    return lat, lon

def get_altitude(exif_data):
    """ extract altitude if avalaible from the
    provided exif_data (obtained through get_exif_data above)"""
    alt = None
    try:
        if not "GPSInfo" in exif_data:
            return None
        gps_info = exif_data["GPSInfo"]
        gps_altitude = gps_info.get('GPSAltitude')
        gps_altitude_ref = gps_info.get('GPSAltitudeRef')
        if gps_altitude:
            alt = float(gps_altitude[0]) / float(gps_altitude[1])
            if gps_altitude_ref == 1:
                alt *=-1
    except:
        return None
    return alt

def get_timestamp(exif_data):
    """ extract the timestamp if avalaible as datetime  from the
    provided exif_data (obtained through get_exif_data above)"""
    dt = None
    utc = pytz.utc
    try:
        if not "GPSInfo" in exif_data:
            return None
        gps_info = exif_data["GPSInfo"]
        gps_time_stamp = gps_info.get('GPSTimeStamp')
        if 'GPSDateStamp' in gps_info:
            gps_date = [int(i) for i in gps_info['GPSDateStamp'].split(':')]
        elif 29 in gps_info:
            gps_date = [int(i) for i in gps_info[29].split(':')]
        else:
            gps_date = None
        if gps_time_stamp and gps_date:
            yy = gps_date[0]
            mm = gps_date[1]
            dd = gps_date[2]
            h = int(float(gps_time_stamp[0][0]) / float(gps_time_stamp[0][1]))
            m = int(float(gps_time_stamp[1][0]) / float(gps_time_stamp[1][1]))
            s = int(float(gps_time_stamp[2][0]) / float(gps_time_stamp[2][1]))
            dt = utc.localize(datetime.datetime(yy, mm,dd,h,m,s))
    except:
        return None
    if dt is None:
        return None
    return dt.strftime('%s')


def get_image(filepath):
    try:
        img = Image.open(filepath)
        # if not img.valid():
        #     return None
        return img
    except Exception, e:
        # print e
        return None


titles = ["file", "type", "geo", "timestamp", "altitude"]
res_json = {
    'titles': titles,
    'items': [],
}

i = 0
homedir = "/Users/frankiepo/Projects/file_clustering/src"
for root, dirs, files in os.walk(homedir + "/images/test_photos/"):
    # for i in range(8147):
    # for i in range(57):
    for file in files:
        filepath = os.path.join(root, file)
        # image = get_image('/Users/frankiepo/Projects/file_clustering/images_2016_08/validation/downloaded_images/{}.jpg'.format(i))
        image = get_image(filepath)
        if image:
            altitude = None
            timestamp = None
            lat_lng = None
            exif_data = get_exif_data(image)
            if exif_data:
                timestamp = get_timestamp(exif_data)
                lat_lng = get_lat_lon(exif_data)
                altitude = get_altitude(exif_data)
            image.thumbnail((50, 50), Image.ANTIALIAS)
            thumbnail_path = "/images/thumbnails/thumbnail_50_50_%s" % (file)
            image.save(homedir + thumbnail_path)
            data = {
                'file': file,
                'type': 'image',
                'geo': lat_lng,
                'timestamp': timestamp,
                'altitude': altitude,
                'tags': get_tags(filepath),
                'thumbnail': thumbnail_path,
            }
            res_json['items'].append(data)
            i += 1
            print i

with io.open('photos.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(res_json, ensure_ascii=False, indent=4, sort_keys=True))
