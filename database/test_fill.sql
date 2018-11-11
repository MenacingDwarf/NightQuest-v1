INSERT INTO "user" (user_id,login, password)
VALUES (1,'MenacingDwarf', 'testpassword');
INSERT INTO "user" (user_id,login, password)
VALUES (2,'Vasya', 'qwerty12345');
INSERT INTO "user" (user_id,login, password)
VALUES (3,'Petya', 'qwer1234');

INSERT INTO "quest"
VALUES (1,'Night Quest','20-11-18 15:00:00',1);

INSERT INTO "puzzle"
VALUES (1,1,'First puzzle','html','02:00:00');
INSERT INTO "puzzle"
VALUES (2,1,'Second puzzle','html','02:00:00');

INSERT INTO "answer"
VALUES (1,1,'hfj');
INSERT INTO "answer"
VALUES (2,1,'6hw');
INSERT INTO "answer"
VALUES (3,1,'k71');
INSERT INTO "answer"
VALUES (4,1,'dn2');
INSERT INTO "answer"
VALUES (5,2,'u7s');
INSERT INTO "answer"
VALUES (6,2,'d8d');
INSERT INTO "answer"
VALUES (7,2,'kd9');
INSERT INTO "answer"
VALUES (8,2,'akd');
INSERT INTO "answer"
VALUES (9,2,'k2o');
INSERT INTO "answer"
VALUES (10,2,'mf9');

INSERT INTO "hint"
VALUES (1,1,'00:15:00','very useful hint','00:05:00');
INSERT INTO "hint"
VALUES (2,2,'00:10:00','very useful hint','00:00:00');

INSERT INTO "user_quest"
VALUES (2,1,1,'20-11-18 15:00:00',0,'00:00:00');
INSERT INTO "user_quest"
VALUES (3,1,2,'20-11-18 15:00:00',0,'00:00:00');



