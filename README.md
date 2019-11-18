# Setup

Setup creates mongo server in docker container. If you want use locally installed mongoDB configure 
.env file. MongoDB creates collections automatically when you save new instances inside, 
so you don't need to do nothing more.

```bash
$ sh ./setup.sh
```

# Run development server

Make sure that mongoDB is running.

```bash
$ npm run start:watch
```

