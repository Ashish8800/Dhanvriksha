pipeline{
    agent any
    
    environment {
        GITHUB_TOKEN= credentials('gittoken')
        PATH = "$PATH:/usr/bin" // Add the directory where docker-compose is installed
    }
    
    stages{

        stage("building the code"){
            steps{
                echo "Building the Image"
                sh "cd ${WORKSPACE}/Dhanvriksha_Server && docker build -t ghcr.io/ashish8800/dhan_backend:latest ."
            }
                       
        }    
            
        
        stage("Push to Docker Hub"){
            steps{
                echo "Pushing the Image"
                sh "export CR_PAT=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"
                sh "echo $GITHUB_TOKEN_PSW | docker login ghcr.io -u $GITHUB_TOKEN_USR --password-stdin"
                sh "docker push ghcr.io/ashish8800/dhan_backend:latest"
                
            }
            
        }
        stage("Deploy"){
            steps{
                echo "Deploying the Container"
                sh "docker-compose down --rmi all && docker-compose up -d"
            }
           
        }
    }
}
