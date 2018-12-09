-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2018-12-01 10:04:30.454

-- tables
-- Table: answer
CREATE TABLE answer (
    answer_id serial  NOT NULL,
    puzzle_id int  NOT NULL,
    value varchar(20)  NOT NULL,
    CONSTRAINT answer_pk PRIMARY KEY (answer_id)
);

-- Table: hint
CREATE TABLE hint (
    hint_id serial  NOT NULL,
    puzzle_id int  NOT NULL,
    fine_minutes int  NOT NULL,
    open_minutes int  NOT NULL,
    html varchar(50)  NOT NULL,
    CONSTRAINT hint_pk PRIMARY KEY (hint_id)
);

-- Table: puzzle
CREATE TABLE puzzle (
    puzzle_id serial  NOT NULL,
    quest_id int  NOT NULL,
    title varchar(50)  NOT NULL,
    html varchar(50)  NOT NULL,
    autoskip_minutes int  NOT NULL,
    CONSTRAINT puzzle_pk PRIMARY KEY (puzzle_id)
);

-- Table: quest
CREATE TABLE quest (
    quest_id serial  NOT NULL,
    owner int  NOT NULL,
    title varchar(50)  NOT NULL,
    start_date timestamp  NOT NULL,
    CONSTRAINT quest_pk PRIMARY KEY (quest_id)
);

-- Table: user
CREATE TABLE "user" (
    user_id serial  NOT NULL,
    nickname varchar(50)  NOT NULL,
    password varchar(100) NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY (user_id)
);

-- Table: user_answer
CREATE TABLE user_answer (
    user_id int  NOT NULL,
    answer_id int  NOT NULL,
    time timestamp  NOT NULL,
    CONSTRAINT user_answer_pk PRIMARY KEY (user_id,answer_id)
);

-- Table: user_hint
CREATE TABLE user_hint (
    user_id int  NOT NULL,
    hint_id int  NOT NULL,
    time timestamp  NOT NULL,
    CONSTRAINT user_hint_pk PRIMARY KEY (user_id,hint_id)
);

-- Table: user_puzzle
CREATE TABLE user_puzzle (
    puzzle_id int  NOT NULL,
    user_id int  NOT NULL,
    time time  NOT NULL,
    CONSTRAINT user_puzzle_pk PRIMARY KEY (user_id,puzzle_id)
);

-- Table: user_quest
CREATE TABLE user_quest (
    user_id int  NOT NULL,
    quest_id int  NOT NULL,
    current_puzzle_id int  NOT NULL,
    current_puzzle_time timestamp  NOT NULL,
    summary_fine int  NOT NULL,
    CONSTRAINT user_quest_pk PRIMARY KEY (user_id,quest_id)
);

-- foreign keys
-- Reference: answer_puzzle (table: answer)
ALTER TABLE answer ADD CONSTRAINT answer_puzzle
    FOREIGN KEY (puzzle_id)
    REFERENCES puzzle (puzzle_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: hint_puzzle (table: hint)
ALTER TABLE hint ADD CONSTRAINT hint_puzzle
    FOREIGN KEY (puzzle_id)
    REFERENCES puzzle (puzzle_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: puzzle_quest (table: puzzle)
ALTER TABLE puzzle ADD CONSTRAINT puzzle_quest
    FOREIGN KEY (quest_id)
    REFERENCES quest (quest_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: quest_user (table: quest)
ALTER TABLE quest ADD CONSTRAINT quest_user
    FOREIGN KEY (owner)
    REFERENCES "user" (user_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: user_answer_answer (table: user_answer)
ALTER TABLE user_answer ADD CONSTRAINT user_answer_answer
    FOREIGN KEY (answer_id)
    REFERENCES answer (answer_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: user_answer_user (table: user_answer)
ALTER TABLE user_answer ADD CONSTRAINT user_answer_user
    FOREIGN KEY (user_id)
    REFERENCES "user" (user_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: user_hint_hint (table: user_hint)
ALTER TABLE user_hint ADD CONSTRAINT user_hint_hint
    FOREIGN KEY (hint_id)
    REFERENCES hint (hint_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: user_hint_user (table: user_hint)
ALTER TABLE user_hint ADD CONSTRAINT user_hint_user
    FOREIGN KEY (user_id)
    REFERENCES "user" (user_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: user_puzzle_puzzle (table: user_puzzle)
ALTER TABLE user_puzzle ADD CONSTRAINT user_puzzle_puzzle
    FOREIGN KEY (puzzle_id)
    REFERENCES puzzle (puzzle_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: user_puzzle_user (table: user_puzzle)
ALTER TABLE user_puzzle ADD CONSTRAINT user_puzzle_user
    FOREIGN KEY (user_id)
    REFERENCES "user" (user_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: user_quest_quest (table: user_quest)
ALTER TABLE user_quest ADD CONSTRAINT user_quest_quest
    FOREIGN KEY (quest_id)
    REFERENCES quest (quest_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: user_quest_user (table: user_quest)
ALTER TABLE user_quest ADD CONSTRAINT user_quest_user
    FOREIGN KEY (user_id)
    REFERENCES "user" (user_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

