-- ============================================================
-- Cashy – extra demo users with lots of data
-- Password for all accounts: "password"
--
-- Data is generated relative to CURRENT_DATE (18 months back up to today),
-- so budgets, the daily budget and notifications always look current.
-- Safe to run more than once: users whose email already exists are skipped.
-- ============================================================

-- Inserts a transaction unless its date is in the future
CREATE OR REPLACE FUNCTION pg_temp.add_tx(
  p_user BIGINT, p_amount DOUBLE PRECISION, p_type TEXT, p_description TEXT,
  p_date DATE, p_category BIGINT, p_payment_method BIGINT
) RETURNS VOID AS $$
BEGIN
  IF p_date <= CURRENT_DATE THEN
    INSERT INTO transactions (amount, type, description, date, user_id, category_id, payment_method_id)
    VALUES (round(p_amount::NUMERIC, 2), p_type, p_description, p_date, p_user, p_category, p_payment_method);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Random element of a text array
CREATE OR REPLACE FUNCTION pg_temp.pick(p_options TEXT[]) RETURNS TEXT AS $$
  SELECT p_options[1 + floor(random() * array_length(p_options, 1))::INT];
$$ LANGUAGE sql;

-- Random day inside the given month (1-based, never past the month end)
CREATE OR REPLACE FUNCTION pg_temp.day_in(p_month DATE) RETURNS DATE AS $$
  SELECT p_month + floor(random() * extract(DAY FROM (p_month + INTERVAL '1 month - 1 day')))::INT;
$$ LANGUAGE sql;

DO $$
DECLARE
  pwd CONSTANT TEXT := '$2a$10$.yBBL9lZGDAB/rBGX.yQC.INm7Zlkntce1uH8MkowgJxNWxr9QK8.';
  first_month CONSTANT DATE := (date_trunc('month', CURRENT_DATE) - INTERVAL '17 months')::DATE;
  this_month CONSTANT DATE := date_trunc('month', CURRENT_DATE)::DATE;
  p RECORD;
  uid BIGINT;
  c_salary BIGINT; c_freelance BIGINT; c_groceries BIGINT; c_dining BIGINT; c_transport BIGINT;
  c_housing BIGINT; c_utilities BIGINT; c_entertainment BIGINT; c_shopping BIGINT; c_health BIGINT;
  c_subscriptions BIGINT;
  pm_cash BIGINT; pm_card BIGINT; pm_bank BIGINT;
  m DATE;
  b_id BIGINT;
  i INT;
BEGIN
  PERFORM setseed(0.42);

  FOR p IN
    SELECT * FROM (VALUES
      -- email,                username,    role,      salary, housing, housing label,  spend, freelance chance
      ('ivan@cashy.com',       'ivan',      'PREMIUM', 3400,   1100,    'Rent',          1.4,   0.3),
      ('elena@cashy.com',      'elena',     'USER',    950,    380,     'Dorm rent',     0.6,   0.2),
      ('georgi@cashy.com',     'georgi',    'PREMIUM', 2700,   720,     'Mortgage',      1.7,   0.1),
      ('petya@cashy.com',      'petya',     'USER',    1200,   600,     'Rent',          1.0,   0.9),
      ('nikolay@cashy.com',    'nikolay',   'USER',    1900,   750,     'Rent',          1.1,   0.2),
      ('desislava@cashy.com',  'desislava', 'PREMIUM', 2900,   880,     'Rent',          1.2,   0.4)
    ) AS t(email, username, role, salary, housing, housing_label, spend, freelance_chance)
  LOOP
    CONTINUE WHEN EXISTS (SELECT 1 FROM users WHERE email = p.email);

    INSERT INTO users (email, password, username, role, created_at)
    VALUES (p.email, pwd, p.username, p.role, first_month - 12)
    RETURNING id INTO uid;

    -- Categories
    INSERT INTO categories (name, user_id) VALUES ('Salary', uid)        RETURNING id INTO c_salary;
    INSERT INTO categories (name, user_id) VALUES ('Freelance', uid)     RETURNING id INTO c_freelance;
    INSERT INTO categories (name, user_id) VALUES ('Groceries', uid)     RETURNING id INTO c_groceries;
    INSERT INTO categories (name, user_id) VALUES ('Food & Dining', uid) RETURNING id INTO c_dining;
    INSERT INTO categories (name, user_id) VALUES ('Transport', uid)     RETURNING id INTO c_transport;
    INSERT INTO categories (name, user_id) VALUES ('Housing', uid)       RETURNING id INTO c_housing;
    INSERT INTO categories (name, user_id) VALUES ('Utilities', uid)     RETURNING id INTO c_utilities;
    INSERT INTO categories (name, user_id) VALUES ('Entertainment', uid) RETURNING id INTO c_entertainment;
    INSERT INTO categories (name, user_id) VALUES ('Shopping', uid)      RETURNING id INTO c_shopping;
    INSERT INTO categories (name, user_id) VALUES ('Healthcare', uid)    RETURNING id INTO c_health;
    INSERT INTO categories (name, user_id) VALUES ('Subscriptions', uid) RETURNING id INTO c_subscriptions;

    -- Payment methods
    INSERT INTO payment_methods (name, user_id) VALUES ('Cash', uid)          RETURNING id INTO pm_cash;
    INSERT INTO payment_methods (name, user_id) VALUES ('Debit Card', uid)    RETURNING id INTO pm_card;
    INSERT INTO payment_methods (name, user_id) VALUES ('Bank Transfer', uid) RETURNING id INTO pm_bank;

    -- Transactions: 18 months, roughly 30–40 per month
    FOR m IN SELECT generate_series(first_month, this_month, INTERVAL '1 month')::DATE LOOP
      -- Fixed monthly items
      PERFORM pg_temp.add_tx(uid, p.salary, 'INCOME', 'Monthly salary', m, c_salary, pm_bank);
      PERFORM pg_temp.add_tx(uid, p.housing, 'EXPENSE', p.housing_label, m + 4, c_housing, pm_bank);
      PERFORM pg_temp.add_tx(uid, 55 + random() * 70, 'EXPENSE', 'Electricity bill', m + 14, c_utilities, pm_bank);
      PERFORM pg_temp.add_tx(uid, 25 + random() * 20, 'EXPENSE', 'Water & heating', m + 16, c_utilities, pm_bank);
      PERFORM pg_temp.add_tx(uid, 19.99, 'EXPENSE', 'Internet & mobile', m + 9, c_utilities, pm_card);
      PERFORM pg_temp.add_tx(uid, 12.99, 'EXPENSE', 'Netflix', m + 7, c_subscriptions, pm_card);
      PERFORM pg_temp.add_tx(uid, 9.99, 'EXPENSE', 'Spotify', m + 11, c_subscriptions, pm_card);

      -- Groceries
      FOR i IN 1..(6 + floor(random() * 4))::INT LOOP
        PERFORM pg_temp.add_tx(uid, (12 + random() * 75) * p.spend, 'EXPENSE',
          pg_temp.pick(ARRAY['Lidl', 'Kaufland', 'Billa', 'Fantastico', 'T Market', 'Local bakery']),
          pg_temp.day_in(m), c_groceries, pg_temp.pick(ARRAY[pm_card::TEXT, pm_card::TEXT, pm_cash::TEXT])::BIGINT);
      END LOOP;

      -- Eating out
      FOR i IN 1..(3 + floor(random() * 4))::INT LOOP
        PERFORM pg_temp.add_tx(uid, (8 + random() * 45) * p.spend, 'EXPENSE',
          pg_temp.pick(ARRAY['Lunch with colleagues', 'Pizza night', 'Coffee shop', 'Sushi', 'Burger place', 'Dinner out', 'Takeaway']),
          pg_temp.day_in(m), c_dining, pg_temp.pick(ARRAY[pm_card::TEXT, pm_cash::TEXT])::BIGINT);
      END LOOP;

      -- Transport
      FOR i IN 1..(3 + floor(random() * 5))::INT LOOP
        PERFORM pg_temp.add_tx(uid, (5 + random() * 55) * p.spend, 'EXPENSE',
          pg_temp.pick(ARRAY['Fuel – Shell', 'Fuel – OMV', 'Taxi', 'Public transport card', 'Parking', 'Car wash']),
          pg_temp.day_in(m), c_transport, pm_card);
      END LOOP;

      -- Entertainment
      FOR i IN 1..(1 + floor(random() * 3))::INT LOOP
        PERFORM pg_temp.add_tx(uid, (10 + random() * 60) * p.spend, 'EXPENSE',
          pg_temp.pick(ARRAY['Cinema', 'Concert tickets', 'Bowling', 'Theatre', 'Board game cafe', 'Steam game']),
          pg_temp.day_in(m), c_entertainment, pm_card);
      END LOOP;

      -- Shopping
      FOR i IN 1..(1 + floor(random() * 3))::INT LOOP
        PERFORM pg_temp.add_tx(uid, (20 + random() * 140) * p.spend, 'EXPENSE',
          pg_temp.pick(ARRAY['Clothes – H&M', 'Shoes', 'eMAG order', 'IKEA', 'Books', 'Gift for a friend', 'Electronics accessories']),
          pg_temp.day_in(m), c_shopping, pm_card);
      END LOOP;

      -- Occasional items
      IF random() < 0.35 THEN
        PERFORM pg_temp.add_tx(uid, 25 + random() * 120, 'EXPENSE',
          pg_temp.pick(ARRAY['Pharmacy', 'Dentist', 'Doctor visit', 'Lab tests']),
          pg_temp.day_in(m), c_health, pm_card);
      END IF;
      IF random() < p.freelance_chance THEN
        PERFORM pg_temp.add_tx(uid, 200 + random() * 900, 'INCOME',
          pg_temp.pick(ARRAY['Freelance project', 'Website for a client', 'Consulting', 'Translation work', 'Logo design']),
          pg_temp.day_in(m), c_freelance, pm_bank);
      END IF;
    END LOOP;

    -- Monthly budgets with category limits: last 6 months + the current one
    FOR m IN SELECT generate_series(this_month - INTERVAL '6 months', this_month, INTERVAL '1 month')::DATE LOOP
      INSERT INTO budgets (total_amount, month, year, user_id)
      VALUES (round(p.salary * 0.85), extract(MONTH FROM m), extract(YEAR FROM m), uid)
      RETURNING id INTO b_id;

      INSERT INTO budget_categories (limit_amount, budget_id, category_id) VALUES
        (round(320 * p.spend), b_id, c_groceries),
        (round(160 * p.spend), b_id, c_dining),
        (round(120 * p.spend), b_id, c_transport),
        (round(90 * p.spend),  b_id, c_entertainment),
        (round(150 * p.spend), b_id, c_shopping);
    END LOOP;

    -- Savings goals: one long-term, one with a deadline next week, one already completed
    INSERT INTO goals (name, target_amount, current_amount, deadline, user_id) VALUES
      ('Emergency Fund', p.salary * 3, round((p.salary * 3 * (0.2 + random() * 0.5))::NUMERIC, 2), CURRENT_DATE + 240, uid),
      ('Summer Vacation', 1800, round((900 + random() * 600)::NUMERIC, 2), CURRENT_DATE + 6, uid),
      ('New Laptop', 1500, 1500, CURRENT_DATE - 20, uid),
      ('Car Down Payment', 6000, round((500 + random() * 2000)::NUMERIC, 2), CURRENT_DATE + 420, uid);

    -- Manual daily limits for the last few days (today stays auto-calculated)
    FOR i IN 1..7 LOOP
      INSERT INTO daily_budgets (daily_limit, date, user_id)
      VALUES (round((40 + random() * 40) * p.spend), CURRENT_DATE - i, uid);
    END LOOP;

    -- Recurring transactions
    INSERT INTO recurring_transactions (amount, description, frequency, type, next_date, created_at, user_id, category_id, payment_method_id) VALUES
      (p.salary,  'Monthly salary',    'MONTHLY', 'INCOME',  (this_month + INTERVAL '1 month')::DATE,     first_month, uid, c_salary,        pm_bank),
      (p.housing, p.housing_label,     'MONTHLY', 'EXPENSE', (this_month + INTERVAL '1 month 4 days')::DATE, first_month, uid, c_housing,     pm_bank),
      (12.99,     'Netflix',           'MONTHLY', 'EXPENSE', (this_month + INTERVAL '1 month 7 days')::DATE, first_month, uid, c_subscriptions, pm_card),
      (9.99,      'Spotify',           'MONTHLY', 'EXPENSE', (this_month + INTERVAL '1 month 11 days')::DATE, first_month, uid, c_subscriptions, pm_card),
      (19.99,     'Internet & mobile', 'MONTHLY', 'EXPENSE', (this_month + INTERVAL '1 month 9 days')::DATE, first_month, uid, c_utilities,   pm_card),
      (15.00,     'Gym class',         'WEEKLY',  'EXPENSE', CURRENT_DATE + 1 + floor(random() * 6)::INT,   first_month, uid, c_health,        pm_card);

    -- Notifications: the monthly salary reminder for the last 12 months (read) + a few recent unread ones
    FOR m IN SELECT generate_series(this_month - INTERVAL '11 months', this_month, INTERVAL '1 month')::DATE LOOP
      INSERT INTO notifications (message, is_read, created_at, user_id)
      VALUES ('Auto-applied: "Monthly salary" — ' || to_char(p.salary, 'FM999990.00') || ' on ' || m || '.', TRUE, m + TIME '06:00', uid);
      IF random() < 0.6 THEN
        INSERT INTO notifications (message, is_read, created_at, user_id)
        VALUES ('Heads up: 80% of your "' || pg_temp.pick(ARRAY['Groceries', 'Food & Dining', 'Shopping', 'Entertainment']) || '" budget used.',
                TRUE, pg_temp.day_in(m) + TIME '18:30', uid);
      END IF;
    END LOOP;
    INSERT INTO notifications (message, is_read, created_at, user_id) VALUES
      ('Goal "Summer Vacation" deadline in 6 days. Keep saving!', FALSE, now() - INTERVAL '2 hours', uid),
      ('Reminder: "Gym class" — 15.00 will be automatically applied soon.', FALSE, now() - INTERVAL '1 day', uid),
      ('Goal "New Laptop" completed! You reached your target of 1500.00.', FALSE, now() - INTERVAL '20 days', uid);

    -- Premium users have a paid Stripe payment (only if the payments table exists yet)
    IF p.role = 'PREMIUM' AND to_regclass('public.payments') IS NOT NULL THEN
      EXECUTE 'INSERT INTO payments (stripe_session_id, amount, currency, status, created_at, paid_at, user_id)
               VALUES ($1, 4.99, ''eur'', ''PAID'', $2, $2, $3)'
        USING 'cs_test_seed_' || p.username, (first_month + 30)::TIMESTAMP, uid;
    END IF;

    RAISE NOTICE 'Created demo user % (id %)', p.email, uid;
  END LOOP;
END $$;
