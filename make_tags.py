from clarifai.rest import ClarifaiApp

app = ClarifaiApp()

#app.inputs.create_image_from_url(url='https://samples.clarifai.com/puppy.jpeg', concepts=['my puppy'])
#app.inputs.create_image_from_url(url='https://samples.clarifai.com/wedding.jpg', not_concepts=['my puppy'])
model = app.models.create(model_id="qw1e", concepts=["my puppy"])
model.train()
model = app.models.get('qwe')
model.predict_by_url('https://samples.clarifai.com/metro-north.jpg')