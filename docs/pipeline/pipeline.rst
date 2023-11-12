========
Pipeline
========

The pipeline is run upon pushing new commits to Gitlab and merging a feature branch into the master branch.

The pipeline currently relies on precreated scripts stored in the ``scripts/pipeline`` directory for each job.

Jobs
====

The pipeline contains the following jobs that verify functionality and build the application.

The current jobs are listed below:
 
    - ``Debug``: The debug job ensures that the runners for the project are connecting and executing scripts properly. This is currently set to run automatically and will not contain any fail cases.
    - ``Unit Test``: The unit test job runs the unit tests for the project. This is the hard hat tests described above. This job will run manually on feature branches and automatically on merges to the master branch.
    - ``Deployment``: This job will build the Docker container that stores the application, then run the container on the destination machine. The job runs automatically only on the master branch, and manually on the feature branch.
