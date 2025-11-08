pipeline {
    agent any 

    environment {
        FRONTEND_IMAGE = "mern-frontend:jenkins"
        BACKEND_IMAGE = "mern-backend:jenkins"
        PORT = "5000"
        MONGO_URI = "mongodb://mongo:27017/testdb"
    }

    stages {
        stage("Checkout Code") {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/dhruvvv1611/devops-simple-app.git'
                    ]]
                ])
            }
        }

        stage("Verify Repo") {
            steps {
                sh '''
                echo "Current Directory:"
                pwd
                echo "Files:"
                ls -la
                '''
            }
        }

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
                docker compose up -d || docker-compose up -d
                docker ps
                '''
            }
        }
    }
}
