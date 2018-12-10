DELETE FROM user_puzzle;
DELETE FROM user_answer;
DELETE FROM user_quest;
DELETE FROM user_hint;
DELETE FROM "user" WHERE NOT user_id = 1;

UPDATE quest SET start_date = '12-11-18 01:10:00';
