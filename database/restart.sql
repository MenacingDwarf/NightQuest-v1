DELETE FROM user_puzzle;
DELETE FROM user_answer;
DELETE FROM user_quest;
DELETE FROM "user" WHERE NOT user_id = 1;

UPDATE quest SET start_date = '12-09-18 23:00:00';
