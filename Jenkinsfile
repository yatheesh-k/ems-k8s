pipeline {
    agent any
    tools {
        maven 'maven'
        nodejs 'node18'
    }
    stages {
        stage('Check Changes') {
            steps {
                script {
                    def changeLogSets = currentBuild.changeSets
                    for (changeLogSet in changeLogSets) {
                        for (entry in changeLogSet.items) {
                            echo "Commit: ${entry.commitId} by ${entry.author}"
                            echo "Message: ${entry.msg}"
                            for (file in entry.affectedFiles) {
                                echo "Affected file: ${file.path}"
                            }
                        }
                    }
                }
            }
        }
        stage('Build Frontend') {
            when {
                changeset '**/Frontend/**'
            }
            steps {
                dir('Frontend/payslip_react-main/src/') {
                    sh '''
                    echo "Building front-end"
                    npm install @babel/plugin-proposal-private-property-in-object --save-dev
                    npm audit fix || true
                    npx update-browserslist-db@latest
                    CI=false npm run build
                    npm install
                    npm run build
                    '''
                }
            }
        }
        stage('Build Backend') {
            when {
                changeset '**/Backend/**'
            }
            steps {
                sh 'echo "Building Backend"'
            }
        }
    }
}
