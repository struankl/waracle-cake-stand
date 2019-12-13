CREATE TABLE cake
(
    id        INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    name      VARCHAR(30),
    comment   VARCHAR(2000),
    imageurl  VARCHAR(250),
    yumfactor INTEGER
);
