pipeline {
    agent any 

    environment {
        FRONTEND_IMAGE = "mern-frontend:jenkins"
        BACKEND_IMAGE  = "mern-backend:jenkins"
        PORT           = "5000"
        MONGO_URI      = "mongodb://mongo:27017/testdb"
    }

    stages {
        stage("Prepare .env") {
            steps {
                sh ''' 
                  mkdir -p server
                  cat > server/.env <<EOF
                  PORT=$PORT
                  MONGO_URI=$MONGO_URI
                  EOF
                '''
            }
        }

        stage("Build Docker Images") {
            steps {
                sh '''
                  echo "Building Docker Images..."
                  docker build -t $FRONTEND_IMAGE ./client --build-arg VITE_API_URL=http://localhost:5000/api
                  docker build -t $BACKEND_IMAGE ./server
                '''
            }
        }

        stage("Docker Compose") {
            steps {
                sh '''
                  echo "Starting Docker Compose..."
                  docker compose up -d

                  echo "Waiting for services to stabilize..."
                  docker ps
                '''
            }
        }
    }
}
