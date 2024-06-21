pipeline {
    agent any
    tools{
        maven "maven"
    }
    stages{
        stage('Build Frontend'){
            when {
                changeset "**/Frontend/payslip_react-main/**"
            }
            steps{
                sh 'echo "Building front-end"'
            }
        }
    }
}
