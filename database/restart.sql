DELETE FROM user_puzzle;
DELETE FROM user_answer;

UPDATE quest SET start_date = '12-09-18 12:00:00';
UPDATE user_quest SET current_puzzle_time = '12-09-18 12:00:00';

UPDATE user_quest SET current_puzzle_id = 1 WHERE user_id = 2;
UPDATE user_quest SET current_puzzle_id = 2 WHERE user_id = 3;
