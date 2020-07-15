# Chat-app

This repository contains my work on online chatting application. The website is available here [chat-app](http://online-chatting-app.herokuapp.com/)

### Prerequisites
No specific requirements are needed

### Installing dependencies
*Note*: You can skip this step, if you are installing the packages. 
Dependencies are listed in package.json file. 

* express
* socket.io
* bad-words

Install npm in your distro. You can install the dependencies by running 
`npm install ` in the root folder of the application.

### Directory Structure
- `src/` - source folder which contains all the server-side source code
- `public/` - Contains client side source code

### Details of the package
- `express` - library to handle http requests, response
- `mlmodel.py` - Code to train non DL models. We have three models
	- `1 - SVM`
	- `2 - Random Forest`
	- `3 - Neural Network`
- `dnn.py` - Code to train Deep learning Models. Supports two models given below
    - `1 - CNN`
    - `2 - LSTM`

### Examples
Have a look at `examples/` directory. `ml_example.py` has examples using ML models.
`cnn_example.py`  and `lstm_example.py` has examples using cnn and lstm models. 

### Documentation
Code documentation can be found [here](https://harry-7.github.io/speech-emotion-recognition/html/main.html)

### Installation

Download the project using git command `git clone https://github.com/asmitachavan121/chat-app.git ` Go to `chat-app` directory `package.json` file is provided in the repository. You can run `npm install` to install all the required librabries in the root folder of the application(in this case chat-app).
If you don't have privileges to do so, you can install it at user level by running `python3 setup.py install --user`.  

### Contributing to the repository.
* If you find any problem with the code, please feel free to open an issue.
* Found something you can improve, please send me a pull request with your changes.
I will be more than happy to review and approve them.

**Note**: If you find this code useful, please leave a star :)