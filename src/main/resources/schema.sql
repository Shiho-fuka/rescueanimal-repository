CREATE TABLE rescueanimal (
    animal_id INT AUTO_INCREMENT PRIMARY KEY,
    animal_type VARCHAR(10) NOT NULL,
    region VARCHAR(20) NOT NULL,
    malefemale VARCHAR(10) NOT NULL,
    age INT,
    medical VARCHAR(255),
    owner_id INT NOT NULL
);