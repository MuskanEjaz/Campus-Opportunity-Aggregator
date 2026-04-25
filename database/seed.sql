-- ========== SEED DATA ==========

-- ========== ROLES ==========
INSERT INTO roles (role_name) VALUES ('admin');
INSERT INTO roles (role_name) VALUES ('student');

-- ========== DEPARTMENTS ==========
INSERT INTO departments (dept_name) VALUES ('Computer Science');
INSERT INTO departments (dept_name) VALUES ('Business Administration');
INSERT INTO departments (dept_name) VALUES ('Electrical Engineering');
INSERT INTO departments (dept_name) VALUES ('Media Studies');
INSERT INTO departments (dept_name) VALUES ('Mathematics');
INSERT INTO departments (dept_name) VALUES ('Psychology');

-- ========== CATEGORIES ==========
INSERT INTO categories (category_name) VALUES ('Internship');
INSERT INTO categories (category_name) VALUES ('Scholarship');
INSERT INTO categories (category_name) VALUES ('Hackathon');
INSERT INTO categories (category_name) VALUES ('Workshop');
INSERT INTO categories (category_name) VALUES ('Competition');
INSERT INTO categories (category_name) VALUES ('Research');
INSERT INTO categories (category_name) VALUES ('Exchange Program');
INSERT INTO categories (category_name) VALUES ('Fellowship');

-- ========== TAGS ==========
INSERT INTO tags (tag_name) VALUES ('paid');
INSERT INTO tags (tag_name) VALUES ('remote');
INSERT INTO tags (tag_name) VALUES ('beginner-friendly');
INSERT INTO tags (tag_name) VALUES ('certificate');
INSERT INTO tags (tag_name) VALUES ('team-based');
INSERT INTO tags (tag_name) VALUES ('international');
INSERT INTO tags (tag_name) VALUES ('part-time');
INSERT INTO tags (tag_name) VALUES ('research-based');
INSERT INTO tags (tag_name) VALUES ('competitive');
INSERT INTO tags (tag_name) VALUES ('funded');

-- ========== USERS ==========
-- password_hash values represent bcrypt hash of 'password123'
INSERT INTO users (user_name, email, password_hash, role_id, dept_id)
VALUES ('admin_zainab', 'zainab@campus.edu',
'$2b$10$abcdefghijklmnopqrstuuVGZzMqT1234567890abcdefghijklmno', 1, 1);

INSERT INTO users (user_name, email, password_hash, role_id, dept_id)
VALUES ('sara_khan', 'sara@campus.edu',
'$2b$10$abcdefghijklmnopqrstuuVGZzMqT1234567890abcdefghijklmno', 2, 1);

INSERT INTO users (user_name, email, password_hash, role_id, dept_id)
VALUES ('ali_raza', 'ali@campus.edu',
'$2b$10$abcdefghijklmnopqrstuuVGZzMqT1234567890abcdefghijklmno', 2, 2);

INSERT INTO users (user_name, email, password_hash, role_id, dept_id)
VALUES ('hina_malik', 'hina@campus.edu',
'$2b$10$abcdefghijklmnopqrstuuVGZzMqT1234567890abcdefghijklmno', 2, 3);

INSERT INTO users (user_name, email, password_hash, role_id, dept_id)
VALUES ('umar_farooq', 'umar@campus.edu',
'$2b$10$abcdefghijklmnopqrstuuVGZzMqT1234567890abcdefghijklmno', 2, 4);

INSERT INTO users (user_name, email, password_hash, role_id, dept_id)
VALUES ('ayesha_noor', 'ayesha@campus.edu',
'$2b$10$abcdefghijklmnopqrstuuVGZzMqT1234567890abcdefghijklmno', 2, 1);

-- ========== OPPORTUNITIES ==========
INSERT INTO opportunities (
    title, description, category_id, dept_id, deadline,
    status, opp_mode, is_paid, posted_by
) VALUES (
    'Google Summer of Code 2025',
    'Contribute to open source projects under Google mentorship. Work remotely on real-world software.',
    3, 1, SYSTIMESTAMP + INTERVAL '30' DAY,
    'active', 'remote', 1, 1
);

INSERT INTO opportunities (
    title, description, category_id, dept_id, deadline,
    status, opp_mode, is_paid, posted_by
) VALUES (
    'HEC Need-Based Scholarship',
    'Full scholarship for deserving students covering tuition and monthly stipend.',
    2, 1, SYSTIMESTAMP + INTERVAL '2' DAY,
    'active', 'on-campus', 0, 1
);

INSERT INTO opportunities (
    title, description, category_id, dept_id, deadline,
    status, opp_mode, is_paid, posted_by
) VALUES (
    'NUST Business Case Competition',
    'Present innovative business solutions to a panel of industry judges. Open to all business students.',
    5, 2, SYSTIMESTAMP + INTERVAL '15' DAY,
    'active', 'on-campus', 0, 1
);

INSERT INTO opportunities (
    title, description, category_id, dept_id, deadline,
    status, opp_mode, is_paid, posted_by
) VALUES (
    'AI Research Assistantship',
    'Work alongside faculty on cutting-edge machine learning research. Stipend provided.',
    6, 1, SYSTIMESTAMP + INTERVAL '10' DAY,
    'active', 'on-campus', 1, 1
);

INSERT INTO opportunities (
    title, description, category_id, dept_id, deadline,
    status, opp_mode, is_paid, posted_by
) VALUES (
    'Web Development Bootcamp',
    'Intensive 2-week workshop covering React, Node.js and databases. Certificate provided.',
    4, 1, SYSTIMESTAMP + INTERVAL '5' DAY,
    'active', 'hybrid', 0, 1
);

INSERT INTO opportunities (
    title, description, category_id, dept_id, deadline,
    status, opp_mode, is_paid, posted_by
) VALUES (
    'Erasmus Exchange Program Europe',
    'Study abroad for one semester at a partner European university. Fully funded.',
    7, 3, SYSTIMESTAMP + INTERVAL '45' DAY,
    'active', 'on-campus', 1, 1
);

INSERT INTO opportunities (
    title, description, category_id, dept_id, deadline,
    status, opp_mode, is_paid, posted_by
) VALUES (
    'Digital Marketing Internship',
    'Part-time remote internship at a leading marketing agency. Flexible hours for students.',
    1, 2, SYSTIMESTAMP + INTERVAL '20' DAY,
    'active', 'remote', 1, 1
);

INSERT INTO opportunities (
    title, description, category_id, dept_id, deadline,
    status, opp_mode, is_paid, posted_by
) VALUES (
    'Rhodes Scholarship 2025',
    'Prestigious international scholarship for postgraduate study at Oxford University.',
    8, 1, SYSTIMESTAMP + INTERVAL '60' DAY,
    'active', 'on-campus', 1, 1
);

INSERT INTO opportunities (
    title, description, category_id, dept_id, deadline,
    status, opp_mode, is_paid, posted_by
) VALUES (
    'IEEE Programming Contest',
    'Annual programming competition testing algorithmic thinking and problem solving skills.',
    5, 1, SYSTIMESTAMP + INTERVAL '3' DAY,
    'active', 'on-campus', 0, 1
);

INSERT INTO opportunities (
    title, description, category_id, dept_id, deadline,
    status, opp_mode, is_paid, posted_by
) VALUES (
    'Psychology Research Fellowship',
    'Join a faculty-led research team studying student mental health. Open to psychology students.',
    8, 6, SYSTIMESTAMP + INTERVAL '25' DAY,
    'active', 'on-campus', 1, 1
);

-- ========== OPPORTUNITY TAGS ==========
INSERT INTO opportunity_tags VALUES (1, 1); -- Google SoC → paid
INSERT INTO opportunity_tags VALUES (1, 2); -- Google SoC → remote
INSERT INTO opportunity_tags VALUES (1, 3); -- Google SoC → beginner-friendly
INSERT INTO opportunity_tags VALUES (2, 10); -- HEC Scholarship → funded
INSERT INTO opportunity_tags VALUES (2, 4);  -- HEC Scholarship → certificate
INSERT INTO opportunity_tags VALUES (3, 5);  -- Business Case → team-based
INSERT INTO opportunity_tags VALUES (3, 9);  -- Business Case → competitive
INSERT INTO opportunity_tags VALUES (4, 8);  -- AI Research → research-based
INSERT INTO opportunity_tags VALUES (4, 1);  -- AI Research → paid
INSERT INTO opportunity_tags VALUES (5, 4);  -- Web Bootcamp → certificate
INSERT INTO opportunity_tags VALUES (5, 3);  -- Web Bootcamp → beginner-friendly
INSERT INTO opportunity_tags VALUES (6, 6);  -- Erasmus → international
INSERT INTO opportunity_tags VALUES (6, 10); -- Erasmus → funded
INSERT INTO opportunity_tags VALUES (7, 2);  -- Marketing → remote
INSERT INTO opportunity_tags VALUES (7, 7);  -- Marketing → part-time
INSERT INTO opportunity_tags VALUES (8, 6);  -- Rhodes → international
INSERT INTO opportunity_tags VALUES (8, 10); -- Rhodes → funded
INSERT INTO opportunity_tags VALUES (9, 9);  -- IEEE → competitive
INSERT INTO opportunity_tags VALUES (9, 5);  -- IEEE → team-based
INSERT INTO opportunity_tags VALUES (10, 8); -- Psychology → research-based
INSERT INTO opportunity_tags VALUES (10, 1); -- Psychology → paid

-- ========== USER INTERESTS ==========
INSERT INTO user_interests VALUES (2, 3); -- sara → Hackathon
INSERT INTO user_interests VALUES (2, 6); -- sara → Research
INSERT INTO user_interests VALUES (3, 1); -- ali → Internship
INSERT INTO user_interests VALUES (3, 2); -- ali → Scholarship
INSERT INTO user_interests VALUES (4, 4); -- hina → Workshop
INSERT INTO user_interests VALUES (4, 7); -- hina → Exchange Program
INSERT INTO user_interests VALUES (5, 5); -- umar → Competition
INSERT INTO user_interests VALUES (5, 8); -- umar → Fellowship
INSERT INTO user_interests VALUES (6, 1); -- ayesha → Internship
INSERT INTO user_interests VALUES (6, 3); -- ayesha → Hackathon

-- ========== SAVED OPPORTUNITIES ==========
INSERT INTO saved_opportunities (user_id, opp_id) VALUES (2, 1);
INSERT INTO saved_opportunities (user_id, opp_id) VALUES (2, 4);
INSERT INTO saved_opportunities (user_id, opp_id) VALUES (3, 7);
INSERT INTO saved_opportunities (user_id, opp_id) VALUES (4, 6);
INSERT INTO saved_opportunities (user_id, opp_id) VALUES (5, 9);
INSERT INTO saved_opportunities (user_id, opp_id) VALUES (6, 1);
INSERT INTO saved_opportunities (user_id, opp_id) VALUES (6, 5);

-- ========== OPPORTUNITY VIEWS ==========
INSERT INTO opportunity_views (user_id, opp_id) VALUES (2, 1);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (2, 4);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (2, 9);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (3, 7);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (3, 3);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (4, 6);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (4, 8);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (5, 9);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (5, 3);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (6, 1);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (6, 5);
INSERT INTO opportunity_views (user_id, opp_id) VALUES (6, 2);

-- ========== NOTIFICATIONS ==========
INSERT INTO notifications (user_id, opp_id, message, is_read)
VALUES (2, 9, 'IEEE Programming Contest is expiring in 3 days!', 0);

INSERT INTO notifications (user_id, opp_id, message, is_read)
VALUES (3, 7, 'New internship posted: Digital Marketing Internship', 0);

INSERT INTO notifications (user_id, opp_id, message, is_read)
VALUES (4, 2, 'HEC Need-Based Scholarship deadline is almost here!', 0);

INSERT INTO notifications (user_id, opp_id, message, is_read)
VALUES (5, 9, 'Reminder: IEEE Programming Contest closes soon', 1);

INSERT INTO notifications (user_id, opp_id, message, is_read)
VALUES (6, 1, 'Google Summer of Code applications are now open', 1);

-- ========== APPLICATIONS LOG ==========
INSERT INTO applications_log (user_id, opp_id, action_type)
VALUES (2, 1, 'applied');

INSERT INTO applications_log (user_id, opp_id, action_type)
VALUES (3, 7, 'applied');

INSERT INTO applications_log (user_id, opp_id, action_type)
VALUES (4, 6, 'applied');

INSERT INTO applications_log (user_id, opp_id, action_type)
VALUES (5, 9, 'applied');

INSERT INTO applications_log (user_id, opp_id, action_type)
VALUES (2, 4, 'withdrawn');

-- ========== COMMIT ALL ==========
COMMIT;