pipeline {
    agent any
    stages {
        stage('Custom-filters') {
            steps {
                dir('Backend/pay_slip2-test/ems') {
                    // Execute Maven build for custom-filter
                    sh './mvnw clean install -U'
                    sh './mvnw clean install'
                }
            }
        }
        // stage('Payslips') {
        //     steps {
        //         dir('payslips') {
        //             // Execute Maven build for payslip
        //             sh './mvnw clean install -U'
        //             sh './mvnw clean install'
        //             sh 'java -jar target/payslips-0.0.1-SNAPSHOT.jar &'
        //         }
        //     }
        // }
    }
    post {
        always {
            script {
                def buildNumber = BUILD_NUMBER as int
                if (buildNumber > 1) {
                    milestone(buildNumber - 1)
                }
                milestone(buildNumber)
            }
        }
    }
}
