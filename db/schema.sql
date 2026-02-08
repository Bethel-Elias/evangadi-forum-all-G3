CREATE DATABASE IF NOT EXISTS evangadi_forum;

USE evangadi_forum;

CREATE TABLE IF NOT EXISTS users_Table (
  userid INT(20) NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  firstname VARCHAR(20) NOT NULL,
  lastname VARCHAR(20) NOT NULL,
  email VARCHAR(40) NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userid)
);

CREATE TABLE IF NOT EXISTS questions_Table (
    id INT(20) NOT NULL AUTO_INCREMENT,
    questionid VARCHAR(100) NOT NULL UNIQUE, 
    userid INT(20) NOT NULL,                   
    title VARCHAR(50) NOT NULL,            
    description VARCHAR(200) NOT NULL,                     
    tags VARCHAR(20),                       
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY(id, questionid), 
    FOREIGN KEY(userid) REFERENCES users_Table(userid)
);

CREATE TABLE IF NOT EXISTS answers_table (
    answerid INT(20) NOT NULL AUTO_INCREMENT,
    userid INT(20) NOT NULL,
    questionid VARCHAR(100) NOT NULL,
    answer VARCHAR(200) NOT NULL,
    PRIMARY KEY(answerid),
    FOREIGN KEY(questionid) REFERENCES questions_Table(questionid),
    FOREIGN KEY(userid) REFERENCES users_Table(userid)
);

CREATE TABLE IF NOT EXISTS answer_comments (
  commentid INT(20) NOT NULL AUTO_INCREMENT,
  answerid INT(20) NOT NULL,
  userid INT(20) NOT NULL,
  comment VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (commentid),
  FOREIGN KEY (answerid) REFERENCES answers_table(answerid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users_Table(userid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answer_likes (
  id INT(20) NOT NULL AUTO_INCREMENT,
  answerid INT(20) DEFAULT NULL,
  userid INT(20) NOT NULL,
  type ENUM('like', 'comment', 'dislike') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (answerid) REFERENCES answers_table(answerid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users_Table(userid) ON DELETE CASCADE
);
