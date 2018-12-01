BEGIN;
INSERT INTO "user"
VALUES (DEFAULT,'MenacingDwarf');
INSERT INTO "user"
VALUES (DEFAULT,'Vasya');
INSERT INTO "user"
VALUES (DEFAULT,'Petya');
COMMIT;

INSERT INTO "quest"
VALUES (DEFAULT,1,'Night Quest','01-12-18 12:15:00');
COMMIT;

INSERT INTO "puzzle"
VALUES (DEFAULT,1,'Странный памятник','puzzles/1.html',120);
INSERT INTO "puzzle"
VALUES (DEFAULT,1,'Навигатор','puzzles/2.html',120);
INSERT INTO "puzzle"
VALUES (DEFAULT,1,'Заметки','puzzles/3.html',120);
INSERT INTO "puzzle"
VALUES (DEFAULT,1,'Печальная история','puzzles/4.html',120);
INSERT INTO "puzzle"
VALUES (DEFAULT,1,'Не обижайтесь :)','puzzles/5.html',120);
COMMIT;

INSERT INTO "answer"
VALUES (DEFAULT,1,'hfj');
INSERT INTO "answer"
VALUES (DEFAULT,1,'6hw');
INSERT INTO "answer"
VALUES (DEFAULT,1,'k71');
INSERT INTO "answer"
VALUES (DEFAULT,1,'dn2');
INSERT INTO "answer"
VALUES (DEFAULT,2,'u7s');
INSERT INTO "answer"
VALUES (DEFAULT,2,'d8d');
INSERT INTO "answer"
VALUES (DEFAULT,2,'kd9');
INSERT INTO "answer"
VALUES (DEFAULT,2,'akd');
INSERT INTO "answer"
VALUES (DEFAULT,2,'k2o');
INSERT INTO "answer"
VALUES (DEFAULT,2,'mf9');
INSERT INTO "answer"
VALUES (DEFAULT,3,'ddk');
INSERT INTO "answer"
VALUES (DEFAULT,3,'df3');
INSERT INTO "answer"
VALUES (DEFAULT,3,'2f3');
INSERT INTO "answer"
VALUES (DEFAULT,4,'sd3');
INSERT INTO "answer"
VALUES (DEFAULT,4,'ksd');
INSERT INTO "answer"
VALUES (DEFAULT,4,'2ft');
INSERT INTO "answer"
VALUES (DEFAULT,5,'3g5');
INSERT INTO "answer"
VALUES (DEFAULT,5,'ff4');
INSERT INTO "answer"
VALUES (DEFAULT,5,'jwv');

INSERT INTO "hint"
VALUES (DEFAULT,1,5,15,'very useful hint');
INSERT INTO "hint"
VALUES (DEFAULT,2,0,10,'very useful hint');

INSERT INTO "user_quest"
VALUES (2,1,1,'01-12-18 12:15:00',0,0);
INSERT INTO "user_quest"
VALUES (3,1,2,'01-12-18 12:15:00',0,0);
COMMIT;


