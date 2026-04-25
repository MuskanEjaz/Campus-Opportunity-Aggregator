-- ========== Droppping Tables ==========
DROP TABLE applications_log;
DROP TABLE opportunity_views;
DROP TABLE notifications;
DROP TABLE user_interests;
DROP TABLE saved_opportunities;
DROP TABLE opportunity_tags;
DROP TABLE opportunities;
DROP TABLE users;
DROP TABLE tags;
DROP TABLE categories;
DROP TABLE departments;
DROP TABLE roles;


-- ========== Creating Tables ==========
CREATE TABLE roles (
    role_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_name VARCHAR2(50) NOT NULL UNIQUE
);

CREATE TABLE departments (
    dept_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dept_name VARCHAR2(50) NOT NULL UNIQUE
);

CREATE TABLE categories (
    category_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name VARCHAR2(50) NOT NULL UNIQUE
);

CREATE TABLE tags (
    tag_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tag_name VARCHAR2(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_name VARCHAR2(50) NOT NULL UNIQUE,
    email VARCHAR2(100) NOT NULL UNIQUE,
    password_hash VARCHAR2(100) NOT NULL,
    role_id NUMBER NOT NULL,
    dept_id NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_users_roles
        FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT fk_users_department
        FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

CREATE TABLE opportunities (
    opp_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR2(50) NOT NULL
        CHECK (LENGTH(title) >= 5),
    description VARCHAR2(300) NOT NULL,
    category_id NUMBER NOT NULL,
    dept_id NUMBER NOT NULL,
    deadline TIMESTAMP NOT NULL,
    status VARCHAR2(20) NOT NULL
        CHECK (status IN ('active', 'expired', 'pending')),
    opp_mode VARCHAR2(20) NOT NULL
        CHECK (opp_mode IN('remote', 'on-campus', 'hybrid')),
    is_paid NUMBER(1) NOT NULL
        CHECK (is_paid IN (0, 1)),
    views_count NUMBER DEFAULT 0 NOT NULL,
    save_count NUMBER DEFAULT 0 NOT NULL,
    posted_by NUMBER NOT NULL,  -- The user id
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_opportunities_categories
        FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT fk_opportunities_departments
        FOREIGN KEY (dept_id) REFERENCES departments(dept_id),
    CONSTRAINT fk_opportunities_users
        FOREIGN KEY (posted_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE opportunity_tags (
    opp_id NUMBER NOT NULL,
    tag_id NUMBER NOT NULL,
    CONSTRAINT pk_opportunity_tags 
        PRIMARY KEY (opp_id, tag_id),
    CONSTRAINT fk_opptags_opportunities
        FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id) ON DELETE CASCADE,
    CONSTRAINT fk_opptags_tags
        FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

CREATE TABLE saved_opportunities (
    save_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    opp_id NUMBER NOT NULL,
    saved_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT user_opp_saved UNIQUE (user_id, opp_id),
    CONSTRAINT fk_saved_users
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_opportunities
        FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id) ON DELETE CASCADE
);

CREATE TABLE user_interests (
    user_id NUMBER NOT NULL,
    category_id NUMBER NOT NULL,
    CONSTRAINT pk_user_interests 
        PRIMARY KEY (user_id, category_id),
    CONSTRAINT fk_interests_users
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_interests_categories
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    notif_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    opp_id NUMBER,
    message VARCHAR2(200) NOT NULL,
    is_read NUMBER(1) NOT NULL
        CHECK (is_read IN (0, 1)),
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_notifications_users
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_opportunities
        FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id) ON DELETE CASCADE
);

CREATE TABLE opportunity_views (
    view_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    opp_id NUMBER NOT NULL,
    viewed_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_oppviews_users
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_oppviews_opportunities
        FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id) ON DELETE CASCADE
);

CREATE TABLE applications_log (
    log_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    opp_id NUMBER NOT NULL,
    action_type VARCHAR(50) NOT NULL
        CHECK (action_type IN ('applied', 'withdrawn', 'shortlisted', 'rejected')),
    action_time TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_app_users
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_app_opportunities
        FOREIGN KEY (opp_id) REFERENCES opportunities(opp_id) ON DELETE CASCADE
);



-- ========== INDEXES ==========
-- B-Tree Indexes
CREATE INDEX idx_opp_deadline ON opportunities(deadline);
CREATE INDEX idx_opp_status ON opportunities(status);
CREATE INDEX idx_opp_dept ON opportunities(dept_id);
CREATE INDEX idx_opp_category ON opportunities(category_id);
CREATE INDEX idx_opp_views ON opportunities(views_count);
CREATE INDEX idx_opp_saves ON opportunities(save_count);
CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_notif_read ON notifications(is_read);
CREATE INDEX idx_applog_action ON applications_log(action_type);
CREATE INDEX idx_applog_user ON applications_log(user_id);
CREATE INDEX idx_savedopp_user ON saved_opportunities(user_id);

-- Composite Indexes
CREATE INDEX idx_opp_status_deadline ON opportunities(status, deadline);
CREATE INDEX idx_opp_category_status ON opportunities(category_id, status);
CREATE INDEX idx_opp_trending ON opportunities(views_count, save_count);     -- For getting the trending opportunities

-- Function-Based Indexes
CREATE INDEX idx_opp_title_upper ON opportunities(UPPER(title));
CREATE INDEX idx_opp_desc_upper ON opportunities(UPPER(description));


-- ========== VIEWS ==========
-- To get active opportunitites on the listing page
CREATE OR REPLACE VIEW active_opportunities AS
SELECT o.opp_id, o.title, o.description, c.category_name, d.dept_name, o.deadline, o.opp_mode, o.is_paid, o.views_count, o.save_count, u.user_name AS posted_by, o.created_at
FROM opportunities o JOIN categories c ON o.category_id = c.category_id
                     JOIN departments d ON o.dept_id = d.dept_id
                     JOIN users u ON o.posted_by = u.user_id
WHERE o.status = 'active' AND o.deadline >= SYSTIMESTAMP;

-- Trending opportunities
CREATE OR REPLACE VIEW trending_opportunities AS
SELECT o.opp_id, o.title, o.description, c.category_name, d.dept_name, o.deadline, o.opp_mode, o.is_paid, o.views_count, o.save_count, u.user_name AS posted_by, o.created_at, ROUND((o.views_count * 0.4) + (o.save_count * 0.6), 2) AS trend_score
FROM opportunities o JOIN categories c ON o.category_id = c.category_id
                     JOIN departments d ON o.dept_id = d.dept_id
                     JOIN users u ON o.posted_by = u.user_id
ORDER BY trend_score DESC
FETCH FIRST 10 ROWS ONLY;

-- Soon Expiring Opportunities
CREATE OR REPLACE VIEW expiring_opportunities AS
SELECT o.opp_id, o.title, o.description, c.category_name, d.dept_name, o.deadline, o.opp_mode, o.is_paid, o.views_count, o.save_count, u.user_name AS posted_by, o.created_at
FROM opportunities o JOIN categories c ON o.category_id = c.category_id
                     JOIN departments d ON o.dept_id = d.dept_id
                     JOIN users u ON o.posted_by = u.user_id
WHERE o.status = 'active' AND o.deadline BETWEEN SYSTIMESTAMP AND (SYSTIMESTAMP + INTERVAL '3' DAY);


-- ========== STORED PROCEDURES ==========
-- Adding Opportunities
CREATE OR REPLACE PROCEDURE add_opportunity (
    p_title         IN VARCHAR2,
    p_description   IN VARCHAR2,
    p_category_id   IN NUMBER,
    p_dept_id       IN NUMBER,
    p_deadline      IN TIMESTAMP,
    p_opp_mode      IN VARCHAR2,
    p_is_paid       IN NUMBER,
    p_posted_by     IN NUMBER,
    p_tag_ids       IN SYS.ODCINUMBERLIST,
    p_opp_id        OUT NUMBER
)
AS
BEGIN
    -- Insert the opportunity
    INSERT INTO opportunities (
        title, description, category_id, dept_id,
        deadline, status, opp_mode, is_paid, posted_by
    )
    VALUES (
        p_title, p_description, p_category_id, p_dept_id,
        p_deadline, 'active', p_opp_mode, p_is_paid, p_posted_by
    );

    -- Get the generated ID separately
    SELECT MAX(opp_id) INTO p_opp_id FROM opportunities;

    -- Insert each tag for this opportunity
    FOR i IN 1 .. p_tag_ids.COUNT LOOP
        INSERT INTO opportunity_tags (opp_id, tag_id)
        VALUES (p_opp_id, p_tag_ids(i));
    END LOOP;

    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/


-- Filter Opportunities
CREATE OR REPLACE PROCEDURE filter_opportunities (
    p_category_id   IN NUMBER DEFAULT NULL,
    p_dept_id       IN NUMBER DEFAULT NULL,
    p_opp_mode      IN VARCHAR2 DEFAULT NULL,
    p_is_paid       IN NUMBER DEFAULT NULL,
    p_deadline      IN TIMESTAMP DEFAULT NULL,
    p_results       OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_results FOR
        SELECT 
            o.opp_id,
            o.title,
            o.description,
            c.category_name,
            d.dept_name,
            o.deadline,
            o.opp_mode,
            o.is_paid,
            o.views_count,
            o.save_count,
            u.user_name AS posted_by,
            o.created_at
        FROM opportunities o
        JOIN categories c ON o.category_id = c.category_id
        JOIN departments d ON o.dept_id = d.dept_id
        JOIN users u ON o.posted_by = u.user_id
        WHERE o.status = 'active'
        AND o.deadline >= SYSTIMESTAMP
        AND (p_category_id IS NULL OR o.category_id = p_category_id)
        AND (p_dept_id     IS NULL OR o.dept_id     = p_dept_id)
        AND (p_opp_mode    IS NULL OR o.opp_mode    = p_opp_mode)
        AND (p_is_paid     IS NULL OR o.is_paid     = p_is_paid)
        AND (p_deadline    IS NULL OR o.deadline   <= p_deadline)
        ORDER BY o.deadline ASC;
END;
/

-- Get Recommendations
CREATE OR REPLACE PROCEDURE get_user_recommendations (
    p_user_id IN NUMBER,
    p_results OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_results FOR
        SELECT DISTINCT o.opp_id, o.title, o.description, c.category_name, d.dept_name, o.deadline, o.opp_mode, o.is_paid, o.views_count, o.save_count, u.user_name AS posted_by, ROUND((o.views_count * 0.4) + (o.save_count * 0.6), 2) AS trend_score
        FROM opportunities o
            JOIN categories c ON o.category_id = c.category_id
            JOIN departments d ON o.dept_id = d.dept_id
            JOIN users u ON o.posted_by = u.user_id
            JOIN user_interests ui ON o.category_id = ui.category_id
        WHERE ui.user_id = p_user_id 
            AND o.status = 'active'
            AND deadline >= SYSTIMESTAMP
        ORDER BY trend_score DESC
        FETCH FIRST 10 ROWS ONLY;
END;
/

-- ========== TRIGGERS ==========
-- to update save_count after user bookmarks an opportunity
CREATE OR REPLACE TRIGGER trg_update_save_count
AFTER INSERT ON saved_opportunities
FOR EACH ROW
BEGIN
    UPDATE opportunities
    SET save_count = save_count + 1
    WHERE opp_id = :NEW.opp_id;
END;
/

-- to to decrease save_count after user removes a bookmark of an opportunity
CREATE OR REPLACE TRIGGER trg_decrease_save_count
AFTER DELETE ON saved_opportunities
FOR EACH ROW
BEGIN
    UPDATE opportunities
    SET save_count = save_count - 1
    WHERE opp_id = :OLD.opp_id;
END;
/

-- to increase views_count on an opportunity
CREATE OR REPLACE TRIGGER trg_update_views_count
AFTER INSERT ON opportunity_views
FOR EACH ROW
BEGIN 
    UPDATE opportunities
    SET views_count = views_count + 1
    WHERE opp_id = :NEW.opp_id;
END;
/