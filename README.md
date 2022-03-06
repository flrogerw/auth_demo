# NelNet Authorization API
An Express web server using Swagger(OAS3) to define, validate and serve the NelNet Authorization API endpoints.  This demo includes
both a code documentation UI created using JSDoc as well as a generic Express/SwaggerUI interface where you can interact with the server.
While the AWS calls are mocked, both endpoints on the server are fully functional as are the tests.
I purposely used Javascript Promises to replicate making actual calls to AWS and to implement the async/await methodology.
Both of these interfaces can be accessed using the links listed below once the container is up and running.
This demo runs within a Docker container but testing is done within the local environment.

<br />

### Requirements
&nbsp;&nbsp;&nbsp;&nbsp;_Node >= 16_

&nbsp;&nbsp;&nbsp;&nbsp;_npm >= 6.13.0_

&nbsp;&nbsp;&nbsp;&nbsp;_Docker_


<br />

### Points of Interest

#### Validation
&nbsp;&nbsp;&nbsp;&nbsp;_This project implements OpenApiValidator middleware for validation of the incoming API requests._
#### Security
&nbsp;&nbsp;&nbsp;&nbsp;_This project returns an encrypted Json Web Token containing the Cognito access token._
#### Testing
&nbsp;&nbsp;&nbsp;&nbsp;_Both integration and unit testing are also demonstrated in this demo.(security scans done in the CI/CD pipeline)_
#### Logging
&nbsp;&nbsp;&nbsp;&nbsp;_This project uses a custom logging class.  Logs to STDOUT when running locally._
#### Error Handling
&nbsp;&nbsp;&nbsp;&nbsp;_This project implements an error handler to return generic messages so not to expose system bugs._
#### Documentation
&nbsp;&nbsp;&nbsp;&nbsp;_Once the cluster is running, you can access the documentation using the links below:_

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_NelNet Authorization API code documentation_: [http://localhost:3000](http://localhost:3000)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_NelNet Authorization API interface_: [http://localhost:3000/docs](http://localhost:3000/docs)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_NelNet Complete OpenAPI spec file_: [http://localhost:3000/docs/auth_swagger.yaml](http://localhost:3000/docs/auth_swagger.yaml)

<br />

### Starting the NelNet Cluster
From within the root directory of the project, run the following command:

    npm install
    make build start

This will start an instance of the stack.


<br />

### Testing the NelNet Cluster
From within the root directory of the project, run the following command(after running npm install):

    make test


