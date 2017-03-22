#!/usr/bin/env python
# -*- coding: utf-8 -*-

from clarifai.rest import ClarifaiApp

from pprint import pprint
client_id = "28c115mfoLfciPM973D-sJTCKlUcoVF7GmnAoSWd"
client_secret = "-ZOZuUVzCwdfaciC1kPy9ydKwNmK0mlCv0mprO0r"
app = ClarifaiApp(client_id, client_secret)

# get the general model
model = app.models.get("general-v1.3")

# predict with the model
cl = model.predict_by_filename("/Users/frankiepo/Projects/file_clustering/src/images/htc_one/2013-07-14 19.00.44.jpg", lang="ru")
tag_list = map(lambda item: item['name'], cl['outputs'][0]['data']['concepts'])

print tag_list
