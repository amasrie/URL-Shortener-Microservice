# URL Shortener Microservice

This requires a MongoDB database (let's say 'fcc').
Create a collection with unique indexes, this avoid repeating original and shortened URLs:

db.createCollection("url")
db.url.createIndex({"original_url": 1}, {unique: true})
db.url.createIndex({"short_url": 1}, {unique: true})

Use a .env file to store the url to the MongoDB database and the port to connect (MONGO and PORT variables respectively).