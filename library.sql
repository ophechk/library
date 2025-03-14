-- Category table (définie avant books pour les références)
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Book table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT NOT NULL, -- 1,N relationship with category
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- User table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comment table (1,N → 1,N with books/users)
CREATE TABLE comment (
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    text TEXT NOT NULL,
    comment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id, comment_date),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Insertion of categories
INSERT INTO category (name) VALUES
('Novel'),
('Thriller'),
('Science Fiction'),
('Biography'),
('Fantasy'),
('Essay'),
('Mystery'),
('Historical'),
('Young Adult'),
('Poetry');

-- Insertion of English-language books
INSERT INTO books (title, author, description, category_id) VALUES
('To Kill a Mockingbird', 'Harper Lee', 'A Pulitzer Prize-winning novel set in 1930s Alabama, exploring themes of racial injustice and childhood.', (SELECT id FROM category WHERE name = 'Novel')),
('About a Boy', 'Nick Hornby', 'A humorous and touching story about an unlikely friendship between a man and a 12-year-old boy.', (SELECT id FROM category WHERE name = 'Novel')),
('Frankenstein', 'Mary Shelley', 'A gothic classic exploring themes of creation and humanity.', (SELECT id FROM category WHERE name = 'Novel')),
('Normal People', 'Sally Rooney', 'A contemporary novel about the complex relationship between two Irish millennials.', (SELECT id FROM category WHERE name = 'Novel')),
('It Ends with Us', 'Colleen Hoover', 'A poignant romance addressing themes of love and domestic violence.', (SELECT id FROM category WHERE name = 'Novel')),
('The Defector', 'Chris Hadfield', 'A gripping political thriller by the former astronaut.', (SELECT id FROM category WHERE name = 'Thriller')),
('Wind and Truth', 'Brandon Sanderson', 'A fantasy novel from the acclaimed author of the Stormlight Archive series.', (SELECT id FROM category WHERE name = 'Fantasy')),
('The Hunter', 'Tana French', 'A mystery novel blending suspense and psychological depth.', (SELECT id FROM category WHERE name = 'Mystery')),
('Wellness', 'Nathan Hill', 'A deeply engrossing novel about love, relationships, and modern life.', (SELECT id FROM category WHERE name = 'Novel')),
('Les Misérables', 'Victor Hugo', 'A timeless French classic, available in English translations.', (SELECT id FROM category WHERE name = 'Historical')),
('In the Likely Event', 'Rebecca Yarros', 'A romantic novel exploring fate and second chances.', (SELECT id FROM category WHERE name = 'Novel'));

-- Search for all books in the "Novel" category
SELECT * FROM books WHERE category_id = (SELECT id FROM category WHERE name = 'Novel');

-- Display books by category
SELECT books.title, category.name
FROM books
JOIN category ON books.category_id = category.id
ORDER BY category.name;