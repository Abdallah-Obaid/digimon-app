DROP TABLE IF EXISTS dataDig ;

CREATE TABLE dataDig (
    id serial primary key,
    img VARCHAR(255),
    name VARCHAR(255),
    level VARCHAR(255)
)


INSERT INTO dataDig (img,name,level)  VALUES ('asdasd','asdsa','123');