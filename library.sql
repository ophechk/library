CREATE TABLE users(
   id INT,
   role VARCHAR(50) NOT NULL,
   name VARCHAR(100) NOT NULL,
   email VARCHAR(100) NOT NULL,
   password VARCHAR(255) NOT NULL,
   registration_date DATETIME,
   is_active LOGICAL,
   is_verified LOGICAL,
   created_at DATETIME,
   updated_at DATETIME,
   PRIMARY KEY(id),
   UNIQUE(email)
);

CREATE TABLE category(
   id INT,
   name VARCHAR(50) NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(name)
);

CREATE TABLE books(
   id INT,
   title VARCHAR(255) NOT NULL,
   author VARCHAR(100) NOT NULL,
   description TEXT,
   year_publication INT,
   img_path VARCHAR(255),
   id_1 INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_1) REFERENCES category(id)
);

CREATE TABLE comment(
   id INT,
   id_1 INT,
   text TEXT NOT NULL,
   comment_date DATETIME,
   PRIMARY KEY(id, id_1),
   FOREIGN KEY(id) REFERENCES users(id),
   FOREIGN KEY(id_1) REFERENCES books(id)
);
