pipeline {
    agent any
    stages {
        stage('Custom-filters') {
            steps {
                dir('Backend/pay_slip2-test/ems') {
                    // Execute Maven build for custom-filter
                    sh 'mvn clean install -U'
                    sh 'mvn clean install'
                }
            }
        }
        // stage('Payslips') {
        //     steps {
        //         dir('payslips') {
        //             // Execute Maven build for payslip
        //             sh 'mvn clean install -U'
        //             sh 'mvn clean install'
        //             sh 'java -jar payslips-0.0.1-SNAPSHOT.jar & '
        //         }
        //     }
        // }
    }
}
def buildNumber = BUILD_NUMBER as int; if (buildNumber > 1) milestone(buildNumber - 1); milestone(buildNumber)
