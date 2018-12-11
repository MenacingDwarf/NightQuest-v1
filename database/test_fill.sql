BEGIN;
INSERT INTO "user"
VALUES (DEFAULT,'MenacingDwarf','jndfksdpv');
COMMIT;
INSERT INTO "quest"
VALUES (DEFAULT,1,'Night Quest','12-11-18 13:10:00');
COMMIT;

INSERT INTO "puzzle" 
VALUES(0,1,'Окончил квест','win',10000);
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
VALUES (DEFAULT,1,0,15,'С первой картинкой связан стиль, со второй блюдо, с третьей материал, а с четвёртой фамилия');
INSERT INTO "hint"
VALUES (DEFAULT,1,15,30,'Этот предмет - шуба! Место - памятник Трезини.');
INSERT INTO "hint"
VALUES (DEFAULT,2,0,15,'Проходите этот маршрут на карте');
INSERT INTO "hint"
VALUES (DEFAULT,2,15,30,'Кинотеатр Нео');
INSERT INTO "hint"
VALUES (DEFAULT,3,0,10,'Если бы на улице не было солнечно, мы бы не смогли узнать время');
INSERT INTO "hint"
VALUES (DEFAULT,3,0,20,'Время - это направление');
INSERT INTO "hint"
VALUES (DEFAULT,3,15,30,'Улетел дракон, находящийся в одном из дворов');
INSERT INTO "hint"
VALUES (DEFAULT,4,0,15,'Речь идёт о транспорте');
INSERT INTO "hint"
VALUES (DEFAULT,4,15,30,'Остановка 22-23 линии');
INSERT INTO "hint"
VALUES (DEFAULT,5,0,15,'Одно из слов, полученное при прохождении лабиринта не так просто как кажется...');
INSERT INTO "hint"
VALUES (DEFAULT,5,15,30,'ВСЕГЕИ - Всероссийский Геологический институт');
COMMIT;