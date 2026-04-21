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
    title VARCHAR2(50) NOT NULL,
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
    posted_by NUMBER NOT NULL,
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