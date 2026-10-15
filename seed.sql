-- ============================================================
-- Cashy – PostgreSQL seed data
-- Password for all accounts: "password"
-- ============================================================

-- ---------------------------------------------------------------
-- USERS
-- 1 = admin@cashy.com  (ADMIN)
-- 2 = alex@cashy.com   (PREMIUM) – main demo user, 12 months data
-- 3 = maria@cashy.com  (USER)    – basic demo user
-- ---------------------------------------------------------------
INSERT INTO users (id, email, password, username, role, created_at) VALUES
  (1, 'admin@cashy.com', '$2a$10$.yBBL9lZGDAB/rBGX.yQC.INm7Zlkntce1uH8MkowgJxNWxr9QK8.', 'admin', 'ADMIN',   '2025-08-01 10:00:00'),
  (2, 'alex@cashy.com',  '$2a$10$.yBBL9lZGDAB/rBGX.yQC.INm7Zlkntce1uH8MkowgJxNWxr9QK8.', 'alex',  'PREMIUM', '2025-09-15 09:30:00'),
  (3, 'maria@cashy.com', '$2a$10$.yBBL9lZGDAB/rBGX.yQC.INm7Zlkntce1uH8MkowgJxNWxr9QK8.', 'maria', 'USER',    '2026-02-10 14:00:00');

SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));

-- ---------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------
INSERT INTO categories (id, name, user_id) VALUES
  -- Alex
  (1,  'Salary',        2),
  (2,  'Freelance',     2),
  (3,  'Food & Dining', 2),
  (4,  'Transport',     2),
  (5,  'Utilities',     2),
  (6,  'Entertainment', 2),
  (7,  'Shopping',      2),
  (8,  'Healthcare',    2),
  -- Maria
  (9,  'Salary',        3),
  (10, 'Rent',          3),
  (11, 'Groceries',     3);

SELECT setval(pg_get_serial_sequence('categories', 'id'), (SELECT MAX(id) FROM categories));

-- ---------------------------------------------------------------
-- PAYMENT METHODS
-- ---------------------------------------------------------------
INSERT INTO payment_methods (id, name, user_id) VALUES
  (1, 'Cash',          2),
  (2, 'Credit Card',   2),
  (3, 'Bank Transfer', 2),
  (4, 'Cash',          3),
  (5, 'Credit Card',   3);

SELECT setval(pg_get_serial_sequence('payment_methods', 'id'), (SELECT MAX(id) FROM payment_methods));

-- ---------------------------------------------------------------
-- TRANSACTIONS – Alex (12 months: Oct 2025 → Sep 2026)
-- ---------------------------------------------------------------
INSERT INTO transactions (id, amount, type, description, date, receipt_image, user_id, category_id, payment_method_id) VALUES

  -- October 2025
  (1,  3000.00, 'INCOME',  'Monthly salary',          '2025-10-01', NULL, 2, 1, 3),
  (2,   450.00, 'EXPENSE', 'Groceries & restaurants', '2025-10-05', NULL, 2, 3, 1),
  (3,   120.00, 'EXPENSE', 'Metro & bus passes',      '2025-10-10', NULL, 2, 4, 2),
  (4,   150.00, 'EXPENSE', 'Electricity & internet',  '2025-10-12', NULL, 2, 5, 3),
  (5,    80.00, 'EXPENSE', 'Cinema tickets',           '2025-10-15', NULL, 2, 6, 2),
  (6,   200.00, 'EXPENSE', 'Autumn clothes',           '2025-10-20', NULL, 2, 7, 2),
  (7,   500.00, 'INCOME',  'Freelance project',        '2025-10-25', NULL, 2, 2, 3),

  -- November 2025
  (8,  3000.00, 'INCOME',  'Monthly salary',           '2025-11-01', NULL, 2, 1, 3),
  (9,   500.00, 'EXPENSE', 'Groceries & restaurants',  '2025-11-05', NULL, 2, 3, 1),
  (10,  100.00, 'EXPENSE', 'Transport',                '2025-11-08', NULL, 2, 4, 2),
  (11,  160.00, 'EXPENSE', 'Utilities',                '2025-11-12', NULL, 2, 5, 3),
  (12,  150.00, 'EXPENSE', 'Concert tickets',          '2025-11-18', NULL, 2, 6, 2),
  (13,  300.00, 'EXPENSE', 'Winter jacket',            '2025-11-25', NULL, 2, 7, 2),

  -- December 2025 (holiday month)
  (14, 3000.00, 'INCOME',  'Monthly salary',           '2025-12-01', NULL, 2, 1, 3),
  (15,  800.00, 'INCOME',  'Freelance project',        '2025-12-15', NULL, 2, 2, 3),
  (16,  600.00, 'EXPENSE', 'Holiday dining',           '2025-12-05', NULL, 2, 3, 2),
  (17,  130.00, 'EXPENSE', 'Transport',                '2025-12-08', NULL, 2, 4, 2),
  (18,  170.00, 'EXPENSE', 'Utilities',                '2025-12-10', NULL, 2, 5, 3),
  (19,  350.00, 'EXPENSE', 'Holiday events',           '2025-12-20', NULL, 2, 6, 2),
  (20,  500.00, 'EXPENSE', 'Christmas gifts',          '2025-12-22', NULL, 2, 7, 2),

  -- January 2026
  (21, 3000.00, 'INCOME',  'Monthly salary',           '2026-01-01', NULL, 2, 1, 3),
  (22,  400.00, 'EXPENSE', 'Groceries',                '2026-01-05', NULL, 2, 3, 1),
  (23,   90.00, 'EXPENSE', 'Transport',                '2026-01-08', NULL, 2, 4, 2),
  (24,  155.00, 'EXPENSE', 'Utilities',                '2026-01-12', NULL, 2, 5, 3),
  (25,   60.00, 'EXPENSE', 'Streaming services',       '2026-01-18', NULL, 2, 6, 2),
  (26,  150.00, 'EXPENSE', 'Shopping',                 '2026-01-25', NULL, 2, 7, 2),
  (27,  200.00, 'EXPENSE', 'Doctor visit',             '2026-01-20', NULL, 2, 8, 2),

  -- February 2026
  (28, 3000.00, 'INCOME',  'Monthly salary',           '2026-02-01', NULL, 2, 1, 3),
  (29,  400.00, 'INCOME',  'Freelance project',        '2026-02-20', NULL, 2, 2, 3),
  (30,  420.00, 'EXPENSE', 'Groceries & dining',       '2026-02-05', NULL, 2, 3, 1),
  (31,  110.00, 'EXPENSE', 'Transport',                '2026-02-10', NULL, 2, 4, 2),
  (32,  145.00, 'EXPENSE', 'Utilities',                '2026-02-12', NULL, 2, 5, 3),
  (33,  100.00, 'EXPENSE', 'Entertainment',            '2026-02-15', NULL, 2, 6, 2),
  (34,  220.00, 'EXPENSE', 'Shopping',                 '2026-02-22', NULL, 2, 7, 2),

  -- March 2026
  (35, 3000.00, 'INCOME',  'Monthly salary',           '2026-03-01', NULL, 2, 1, 3),
  (36,  460.00, 'EXPENSE', 'Groceries & dining',       '2026-03-05', NULL, 2, 3, 1),
  (37,  125.00, 'EXPENSE', 'Transport',                '2026-03-08', NULL, 2, 4, 2),
  (38,  160.00, 'EXPENSE', 'Utilities',                '2026-03-12', NULL, 2, 5, 3),
  (39,  130.00, 'EXPENSE', 'Entertainment',            '2026-03-18', NULL, 2, 6, 2),
  (40,  280.00, 'EXPENSE', 'Shopping',                 '2026-03-25', NULL, 2, 7, 2),

  -- April 2026
  (41, 3000.00, 'INCOME',  'Monthly salary',           '2026-04-01', NULL, 2, 1, 3),
  (42,  600.00, 'INCOME',  'Freelance project',        '2026-04-15', NULL, 2, 2, 3),
  (43,  490.00, 'EXPENSE', 'Groceries & dining',       '2026-04-05', NULL, 2, 3, 2),
  (44,  130.00, 'EXPENSE', 'Transport',                '2026-04-08', NULL, 2, 4, 2),
  (45,  155.00, 'EXPENSE', 'Utilities',                '2026-04-12', NULL, 2, 5, 3),
  (46,  180.00, 'EXPENSE', 'Entertainment',            '2026-04-18', NULL, 2, 6, 2),
  (47,  320.00, 'EXPENSE', 'Shopping',                 '2026-04-25', NULL, 2, 7, 2),

  -- May 2026
  (48, 3000.00, 'INCOME',  'Monthly salary',           '2026-05-01', NULL, 2, 1, 3),
  (49,  510.00, 'EXPENSE', 'Groceries & dining',       '2026-05-05', NULL, 2, 3, 1),
  (50,  140.00, 'EXPENSE', 'Transport',                '2026-05-08', NULL, 2, 4, 2),
  (51,  165.00, 'EXPENSE', 'Utilities',                '2026-05-12', NULL, 2, 5, 3),
  (52,   90.00, 'EXPENSE', 'Entertainment',            '2026-05-18', NULL, 2, 6, 2),
  (53,  190.00, 'EXPENSE', 'Shopping',                 '2026-05-25', NULL, 2, 7, 2),
  (54,  150.00, 'EXPENSE', 'Physiotherapy',            '2026-05-20', NULL, 2, 8, 2),

  -- June 2026
  (55, 3200.00, 'INCOME',  'Monthly salary',           '2026-06-01', NULL, 2, 1, 3),
  (56,  700.00, 'INCOME',  'Freelance project',        '2026-06-20', NULL, 2, 2, 3),
  (57,  530.00, 'EXPENSE', 'Groceries & dining',       '2026-06-05', NULL, 2, 3, 2),
  (58,  145.00, 'EXPENSE', 'Transport',                '2026-06-08', NULL, 2, 4, 2),
  (59,  170.00, 'EXPENSE', 'Utilities',                '2026-06-12', NULL, 2, 5, 3),
  (60,  200.00, 'EXPENSE', 'Entertainment',            '2026-06-15', NULL, 2, 6, 2),
  (61,  360.00, 'EXPENSE', 'Summer shopping',          '2026-06-25', NULL, 2, 7, 2),

  -- July 2026
  (62, 3200.00, 'INCOME',  'Monthly salary',           '2026-07-01', NULL, 2, 1, 3),
  (63,  520.00, 'EXPENSE', 'Groceries & dining',       '2026-07-05', NULL, 2, 3, 1),
  (64,  150.00, 'EXPENSE', 'Transport',                '2026-07-08', NULL, 2, 4, 2),
  (65,  175.00, 'EXPENSE', 'Utilities',                '2026-07-12', NULL, 2, 5, 3),
  (66,  250.00, 'EXPENSE', 'Entertainment',            '2026-07-18', NULL, 2, 6, 2),
  (67,  300.00, 'EXPENSE', 'Shopping',                 '2026-07-25', NULL, 2, 7, 2),

  -- August 2026
  (68, 3200.00, 'INCOME',  'Monthly salary',           '2026-08-01', NULL, 2, 1, 3),
  (69,  500.00, 'INCOME',  'Freelance project',        '2026-08-25', NULL, 2, 2, 3),
  (70,  540.00, 'EXPENSE', 'Groceries & dining',       '2026-08-05', NULL, 2, 3, 2),
  (71,  155.00, 'EXPENSE', 'Transport',                '2026-08-08', NULL, 2, 4, 2),
  (72,  180.00, 'EXPENSE', 'Utilities',                '2026-08-12', NULL, 2, 5, 3),
  (73,  220.00, 'EXPENSE', 'Entertainment',            '2026-08-18', NULL, 2, 6, 2),
  (74,  350.00, 'EXPENSE', 'Back-to-school shopping',  '2026-08-22', NULL, 2, 7, 2),
  (75,   80.00, 'EXPENSE', 'Pharmacy',                 '2026-08-28', NULL, 2, 8, 2),

  -- September 2026 (current month, partial)
  (76, 3200.00, 'INCOME',  'Monthly salary',           '2026-09-01', NULL, 2, 1, 3),
  (77,  320.00, 'EXPENSE', 'Groceries',                '2026-09-02', NULL, 2, 3, 1),
  (78,   50.00, 'EXPENSE', 'Transport',                '2026-09-03', NULL, 2, 4, 2),
  (79,  170.00, 'EXPENSE', 'Utilities',                '2026-09-04', NULL, 2, 5, 3),
  (80,  180.00, 'EXPENSE', 'Restaurants',              '2026-09-04', NULL, 2, 3, 2);

-- Alex – historical data (Oct 2024 → Sep 2025)
INSERT INTO transactions (id, amount, type, description, date, receipt_image, user_id, category_id, payment_method_id) VALUES

  -- October 2024
  ( 84, 2800.00, 'INCOME',  'Monthly salary',           '2024-10-01', NULL, 2, 1, 3),
  ( 85,  430.00, 'EXPENSE', 'Groceries & restaurants',  '2024-10-04', NULL, 2, 3, 1),
  ( 86,  110.00, 'EXPENSE', 'Metro & bus passes',       '2024-10-07', NULL, 2, 4, 2),
  ( 87,  140.00, 'EXPENSE', 'Electricity & internet',   '2024-10-10', NULL, 2, 5, 3),
  ( 88,   70.00, 'EXPENSE', 'Movie night',              '2024-10-14', NULL, 2, 6, 2),
  ( 89,  180.00, 'EXPENSE', 'Clothes',                  '2024-10-19', NULL, 2, 7, 2),
  ( 90,  450.00, 'INCOME',  'Freelance project',        '2024-10-28', NULL, 2, 2, 3),

  -- November 2024
  ( 91, 2800.00, 'INCOME',  'Monthly salary',           '2024-11-01', NULL, 2, 1, 3),
  ( 92,  470.00, 'EXPENSE', 'Groceries & restaurants',  '2024-11-05', NULL, 2, 3, 1),
  ( 93,   95.00, 'EXPENSE', 'Transport',                '2024-11-08', NULL, 2, 4, 2),
  ( 94,  155.00, 'EXPENSE', 'Utilities',                '2024-11-11', NULL, 2, 5, 3),
  ( 95,  120.00, 'EXPENSE', 'Theatre tickets',          '2024-11-16', NULL, 2, 6, 2),
  ( 96,  260.00, 'EXPENSE', 'Winter boots',             '2024-11-23', NULL, 2, 7, 2),
  ( 97,  180.00, 'EXPENSE', 'Dental check-up',          '2024-11-27', NULL, 2, 8, 2),

  -- December 2024 (holiday month)
  ( 98, 2800.00, 'INCOME',  'Monthly salary',           '2024-12-01', NULL, 2, 1, 3),
  ( 99,  750.00, 'INCOME',  'Freelance project',        '2024-12-12', NULL, 2, 2, 3),
  (100,  580.00, 'EXPENSE', 'Holiday dining',           '2024-12-06', NULL, 2, 3, 2),
  (101,  125.00, 'EXPENSE', 'Transport',                '2024-12-09', NULL, 2, 4, 2),
  (102,  165.00, 'EXPENSE', 'Utilities',                '2024-12-11', NULL, 2, 5, 3),
  (103,  320.00, 'EXPENSE', 'Holiday events',           '2024-12-19', NULL, 2, 6, 2),
  (104,  480.00, 'EXPENSE', 'Christmas gifts',          '2024-12-21', NULL, 2, 7, 2),
  (105,  100.00, 'EXPENSE', 'Pharmacy',                 '2024-12-28', NULL, 2, 8, 2),

  -- January 2025
  (106, 2800.00, 'INCOME',  'Monthly salary',           '2025-01-01', NULL, 2, 1, 3),
  (107,  390.00, 'EXPENSE', 'Groceries',                '2025-01-04', NULL, 2, 3, 1),
  (108,   85.00, 'EXPENSE', 'Transport',                '2025-01-07', NULL, 2, 4, 2),
  (109,  150.00, 'EXPENSE', 'Utilities',                '2025-01-10', NULL, 2, 5, 3),
  (110,   55.00, 'EXPENSE', 'Streaming services',       '2025-01-15', NULL, 2, 6, 2),
  (111,  140.00, 'EXPENSE', 'Shopping',                 '2025-01-22', NULL, 2, 7, 2),
  (112,  250.00, 'EXPENSE', 'Doctor visit',             '2025-01-25', NULL, 2, 8, 2),

  -- February 2025
  (113, 2800.00, 'INCOME',  'Monthly salary',           '2025-02-01', NULL, 2, 1, 3),
  (114,  380.00, 'INCOME',  'Freelance project',        '2025-02-18', NULL, 2, 2, 3),
  (115,  410.00, 'EXPENSE', 'Groceries & dining',       '2025-02-05', NULL, 2, 3, 1),
  (116,  100.00, 'EXPENSE', 'Transport',                '2025-02-08', NULL, 2, 4, 2),
  (117,  145.00, 'EXPENSE', 'Utilities',                '2025-02-11', NULL, 2, 5, 3),
  (118,   90.00, 'EXPENSE', 'Entertainment',            '2025-02-14', NULL, 2, 6, 2),
  (119,  200.00, 'EXPENSE', 'Shopping',                 '2025-02-20', NULL, 2, 7, 2),

  -- March 2025
  (120, 2800.00, 'INCOME',  'Monthly salary',           '2025-03-01', NULL, 2, 1, 3),
  (121,  440.00, 'EXPENSE', 'Groceries & dining',       '2025-03-05', NULL, 2, 3, 1),
  (122,  115.00, 'EXPENSE', 'Transport',                '2025-03-08', NULL, 2, 4, 2),
  (123,  155.00, 'EXPENSE', 'Utilities',                '2025-03-11', NULL, 2, 5, 3),
  (124,  110.00, 'EXPENSE', 'Entertainment',            '2025-03-17', NULL, 2, 6, 2),
  (125,  230.00, 'EXPENSE', 'Spring shopping',          '2025-03-24', NULL, 2, 7, 2),
  (126,  600.00, 'INCOME',  'Freelance project',        '2025-03-28', NULL, 2, 2, 3),

  -- April 2025
  (127, 2900.00, 'INCOME',  'Monthly salary',           '2025-04-01', NULL, 2, 1, 3),
  (128,  460.00, 'EXPENSE', 'Groceries & dining',       '2025-04-04', NULL, 2, 3, 2),
  (129,  120.00, 'EXPENSE', 'Transport',                '2025-04-07', NULL, 2, 4, 2),
  (130,  150.00, 'EXPENSE', 'Utilities',                '2025-04-10', NULL, 2, 5, 3),
  (131,  160.00, 'EXPENSE', 'Entertainment',            '2025-04-16', NULL, 2, 6, 2),
  (132,  290.00, 'EXPENSE', 'Shopping',                 '2025-04-23', NULL, 2, 7, 2),
  (133,  130.00, 'EXPENSE', 'Physiotherapy',            '2025-04-26', NULL, 2, 8, 2),

  -- May 2025
  (134, 2900.00, 'INCOME',  'Monthly salary',           '2025-05-01', NULL, 2, 1, 3),
  (135,  490.00, 'EXPENSE', 'Groceries & dining',       '2025-05-05', NULL, 2, 3, 1),
  (136,  130.00, 'EXPENSE', 'Transport',                '2025-05-08', NULL, 2, 4, 2),
  (137,  160.00, 'EXPENSE', 'Utilities',                '2025-05-11', NULL, 2, 5, 3),
  (138,   80.00, 'EXPENSE', 'Entertainment',            '2025-05-17', NULL, 2, 6, 2),
  (139,  175.00, 'EXPENSE', 'Shopping',                 '2025-05-24', NULL, 2, 7, 2),
  (140,  500.00, 'INCOME',  'Freelance project',        '2025-05-29', NULL, 2, 2, 3),

  -- June 2025
  (141, 2900.00, 'INCOME',  'Monthly salary',           '2025-06-01', NULL, 2, 1, 3),
  (142,  510.00, 'EXPENSE', 'Groceries & dining',       '2025-06-05', NULL, 2, 3, 2),
  (143,  140.00, 'EXPENSE', 'Transport',                '2025-06-08', NULL, 2, 4, 2),
  (144,  165.00, 'EXPENSE', 'Utilities',                '2025-06-11', NULL, 2, 5, 3),
  (145,  190.00, 'EXPENSE', 'Entertainment',            '2025-06-15', NULL, 2, 6, 2),
  (146,  340.00, 'EXPENSE', 'Summer shopping',          '2025-06-24', NULL, 2, 7, 2),
  (147,  680.00, 'INCOME',  'Freelance project',        '2025-06-27', NULL, 2, 2, 3),

  -- July 2025
  (148, 2900.00, 'INCOME',  'Monthly salary',           '2025-07-01', NULL, 2, 1, 3),
  (149,  500.00, 'EXPENSE', 'Groceries & dining',       '2025-07-05', NULL, 2, 3, 1),
  (150,  145.00, 'EXPENSE', 'Transport',                '2025-07-08', NULL, 2, 4, 2),
  (151,  170.00, 'EXPENSE', 'Utilities',                '2025-07-11', NULL, 2, 5, 3),
  (152,  240.00, 'EXPENSE', 'Entertainment',            '2025-07-17', NULL, 2, 6, 2),
  (153,  280.00, 'EXPENSE', 'Shopping',                 '2025-07-24', NULL, 2, 7, 2),
  (154,   90.00, 'EXPENSE', 'Pharmacy',                 '2025-07-29', NULL, 2, 8, 2),

  -- August 2025
  (155, 2900.00, 'INCOME',  'Monthly salary',           '2025-08-01', NULL, 2, 1, 3),
  (156,  470.00, 'INCOME',  'Freelance project',        '2025-08-22', NULL, 2, 2, 3),
  (157,  520.00, 'EXPENSE', 'Groceries & dining',       '2025-08-05', NULL, 2, 3, 2),
  (158,  150.00, 'EXPENSE', 'Transport',                '2025-08-08', NULL, 2, 4, 2),
  (159,  175.00, 'EXPENSE', 'Utilities',                '2025-08-11', NULL, 2, 5, 3),
  (160,  210.00, 'EXPENSE', 'Entertainment',            '2025-08-17', NULL, 2, 6, 2),
  (161,  330.00, 'EXPENSE', 'Back-to-school shopping',  '2025-08-21', NULL, 2, 7, 2),

  -- September 2025
  (162, 3000.00, 'INCOME',  'Monthly salary',           '2025-09-01', NULL, 2, 1, 3),
  (163,  480.00, 'EXPENSE', 'Groceries & dining',       '2025-09-04', NULL, 2, 3, 1),
  (164,  105.00, 'EXPENSE', 'Transport',                '2025-09-07', NULL, 2, 4, 2),
  (165,  155.00, 'EXPENSE', 'Utilities',                '2025-09-10', NULL, 2, 5, 3),
  (166,  140.00, 'EXPENSE', 'Entertainment',            '2025-09-15', NULL, 2, 6, 2),
  (167,  250.00, 'EXPENSE', 'Shopping',                 '2025-09-22', NULL, 2, 7, 2),
  (168,  550.00, 'INCOME',  'Freelance project',        '2025-09-26', NULL, 2, 2, 3);

-- Maria's transactions
INSERT INTO transactions (id, amount, type, description, date, receipt_image, user_id, category_id, payment_method_id) VALUES
  (169, 2500.00, 'INCOME',  'Monthly salary', '2026-09-01', NULL, 3, 9,  5),
  (170,  800.00, 'EXPENSE', 'Rent',           '2026-09-01', NULL, 3, 10, 5),
  (171,  200.00, 'EXPENSE', 'Groceries',      '2026-09-03', NULL, 3, 11, 4);

SELECT setval(pg_get_serial_sequence('transactions', 'id'), (SELECT MAX(id) FROM transactions));

-- ---------------------------------------------------------------
-- BUDGETS (Alex: Oct 2024 → Sep 2026; Maria: Sep 2026)
-- ---------------------------------------------------------------
INSERT INTO budgets (id, total_amount, month, year, user_id) VALUES
  -- Alex – historical
  ( 3, 3500.00, 10, 2024, 2),
  ( 4, 3500.00, 11, 2024, 2),
  ( 5, 3800.00, 12, 2024, 2),
  ( 6, 3500.00,  1, 2025, 2),
  ( 7, 3500.00,  2, 2025, 2),
  ( 8, 3600.00,  3, 2025, 2),
  ( 9, 3600.00,  4, 2025, 2),
  (10, 3700.00,  5, 2025, 2),
  (11, 3700.00,  6, 2025, 2),
  (12, 3700.00,  7, 2025, 2),
  (13, 3700.00,  8, 2025, 2),
  (14, 4000.00,  9, 2025, 2),
  (15, 4000.00, 10, 2025, 2),
  (16, 4000.00, 11, 2025, 2),
  (17, 4500.00, 12, 2025, 2),
  (18, 4000.00,  1, 2026, 2),
  (19, 4000.00,  2, 2026, 2),
  (20, 4000.00,  3, 2026, 2),
  (21, 4200.00,  4, 2026, 2),
  (22, 4200.00,  5, 2026, 2),
  (23, 4200.00,  6, 2026, 2),
  (24, 4200.00,  7, 2026, 2),
  (25, 4200.00,  8, 2026, 2),
  -- Alex – current month
  ( 1, 4000.00,  9, 2026, 2),
  -- Maria
  ( 2, 2500.00,  9, 2026, 3);

SELECT setval(pg_get_serial_sequence('budgets', 'id'), (SELECT MAX(id) FROM budgets));

-- ---------------------------------------------------------------
-- BUDGET CATEGORIES (per-category spending limits)
-- ---------------------------------------------------------------
INSERT INTO budget_categories (id, limit_amount, budget_id, category_id) VALUES
  (1, 600.00, 1, 3),
  (2, 200.00, 1, 4),
  (3, 300.00, 1, 6),
  (4, 400.00, 1, 7);

SELECT setval(pg_get_serial_sequence('budget_categories', 'id'), (SELECT MAX(id) FROM budget_categories));

-- ---------------------------------------------------------------
-- GOALS
-- ---------------------------------------------------------------
INSERT INTO goals (id, name, target_amount, current_amount, deadline, last_deadline_notification, user_id) VALUES
  ( 1, 'Emergency Fund',       10000.00,  3500.00, '2027-06-01', NULL, 2),
  ( 2, 'Vacation Fund',         2000.00,   800.00, '2027-01-15', NULL, 2),
  ( 4, 'Home Renovation',      20000.00,  5000.00, '2028-06-01', NULL, 2),
  ( 5, 'MacBook Pro',           3000.00,  2200.00, '2026-12-01', NULL, 2),
  ( 6, 'Japan Vacation',        5000.00,  1500.00, '2027-08-01', NULL, 2),
  ( 7, 'Wedding Fund',         25000.00,  8000.00, '2028-09-01', NULL, 2),
  ( 8, 'University Course',     1500.00,   900.00, '2026-11-15', NULL, 2),
  ( 9, 'Camera Equipment',      2500.00,   400.00, '2027-03-01', NULL, 2),
  (10, 'Investment Portfolio', 50000.00, 12000.00, NULL,         NULL, 2),
  (11, 'New Furniture',         4000.00,  3200.00, '2026-12-31', NULL, 2),
  ( 3, 'New Car',              15000.00,  2000.00, '2028-01-01', NULL, 3);

SELECT setval(pg_get_serial_sequence('goals', 'id'), (SELECT MAX(id) FROM goals));

-- ---------------------------------------------------------------
-- DAILY BUDGETS
-- ---------------------------------------------------------------
INSERT INTO daily_budgets (id, daily_limit, date, user_id) VALUES
  (1, 150.00, '2026-09-01', 2),
  (2, 150.00, '2026-09-02', 2),
  (3, 150.00, '2026-09-03', 2),
  (4, 150.00, '2026-09-04', 2);

SELECT setval(pg_get_serial_sequence('daily_budgets', 'id'), (SELECT MAX(id) FROM daily_budgets));

-- ---------------------------------------------------------------
-- RECURRING TRANSACTIONS
-- ---------------------------------------------------------------
INSERT INTO recurring_transactions (id, amount, description, frequency, type, next_date, created_at, user_id, category_id, payment_method_id) VALUES
  (1, 3200.00, 'Monthly salary',   'MONTHLY', 'INCOME',  '2026-10-01', '2025-10-01 08:00:00', 2, 1, 3),
  (2,   15.99, 'Netflix',          'MONTHLY', 'EXPENSE', '2026-10-01', '2025-10-01 08:00:00', 2, 6, 2),
  (3,   50.00, 'Gym membership',   'MONTHLY', 'EXPENSE', '2026-10-01', '2025-10-01 08:00:00', 2, 8, 2),
  (4,  120.00, 'Weekly groceries', 'WEEKLY',  'EXPENSE', '2026-09-08', '2025-10-01 08:00:00', 2, 3, 1),
  (5,    9.99, 'Spotify',          'MONTHLY', 'EXPENSE', '2026-10-01', '2025-10-01 08:00:00', 2, 6, 2),
  (6,   45.00, 'Internet bill',    'MONTHLY', 'EXPENSE', '2026-10-01', '2025-10-01 08:00:00', 2, 5, 3),
  (7,   80.00, 'Health insurance', 'MONTHLY', 'EXPENSE', '2026-10-01', '2025-10-01 08:00:00', 2, 8, 3),
  (8,  700.00, 'Rent',             'MONTHLY', 'EXPENSE', '2026-10-01', '2025-10-01 08:00:00', 2, 5, 3),
  (9,  400.00, 'Side project',     'MONTHLY', 'INCOME',  '2026-10-01', '2025-10-01 08:00:00', 2, 2, 3),
  (10,  12.99, 'YouTube Premium',  'MONTHLY', 'EXPENSE', '2026-10-01', '2025-10-01 08:00:00', 2, 6, 2),
  (11,  30.00, 'Phone bill',       'MONTHLY', 'EXPENSE', '2026-10-01', '2025-10-01 08:00:00', 2, 5, 3),
  (12,  60.00, 'Transport pass',   'MONTHLY', 'EXPENSE', '2026-10-01', '2025-10-01 08:00:00', 2, 4, 2);

SELECT setval(pg_get_serial_sequence('recurring_transactions', 'id'), (SELECT MAX(id) FROM recurring_transactions));

-- ---------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------
INSERT INTO notifications (id, message, is_read, created_at, user_id) VALUES
  -- Current unread
  (1,  'You have reached 83% of your Food & Dining budget for September.',          false, '2026-09-04 11:00:00', 2),
  (2,  'Your overall September budget is 85% spent — watch your spending.',         false, '2026-09-04 11:01:00', 2),
  (3,  '"Vacation Fund" deadline is in 133 days. Keep saving!',                     false, '2026-09-04 08:00:00', 2),
  -- Recent read
  (4,  'Recurring transaction "Weekly groceries" has been applied automatically.',  true,  '2026-09-01 06:00:00', 2),
  (5,  'Recurring transaction "Monthly salary" has been applied automatically.',    true,  '2026-09-01 06:00:00', 2),
  (6,  'Recurring transaction "Netflix" has been applied automatically.',           true,  '2026-09-01 06:00:00', 2),
  -- August 2026
  (7,  'You have exceeded your Shopping budget for August.',                        true,  '2026-08-23 10:00:00', 2),
  (8,  'Recurring transaction "Monthly salary" has been applied automatically.',    true,  '2026-08-01 06:00:00', 2),
  (9,  'Recurring transaction "Gym membership" has been applied automatically.',    true,  '2026-08-01 06:00:00', 2),
  (10, '"MacBook Pro" goal is 73% funded — you are almost there!',                  true,  '2026-08-15 08:00:00', 2),
  -- July 2026
  (11, 'Recurring transaction "Monthly salary" has been applied automatically.',    true,  '2026-07-01 06:00:00', 2),
  (12, 'You have reached 90% of your Entertainment budget for July.',               true,  '2026-07-19 10:00:00', 2),
  (13, 'Recurring transaction "Rent" has been applied automatically.',              true,  '2026-07-01 06:00:00', 2),
  -- June 2026
  (14, 'Recurring transaction "Monthly salary" has been applied automatically.',    true,  '2026-06-01 06:00:00', 2),
  (15, 'New freelance income of €700 recorded.',                                    true,  '2026-06-20 14:00:00', 2),
  (16, '"Japan Vacation" goal is now 30% funded.',                                  true,  '2026-06-10 09:00:00', 2),
  -- May 2026
  (17, 'Recurring transaction "Monthly salary" has been applied automatically.',    true,  '2026-05-01 06:00:00', 2),
  (18, 'You have reached 80% of your Food & Dining budget for May.',                true,  '2026-05-28 11:00:00', 2),
  -- April 2026
  (19, 'Recurring transaction "Monthly salary" has been applied automatically.',    true,  '2026-04-01 06:00:00', 2),
  (20, 'New freelance income of €600 recorded.',                                    true,  '2026-04-15 14:00:00', 2),
  (21, '"Emergency Fund" goal is 35% funded. Keep it up!',                          true,  '2026-04-01 08:00:00', 2),
  -- March 2026
  (22, 'Recurring transaction "Monthly salary" has been applied automatically.',    true,  '2026-03-01 06:00:00', 2),
  (23, 'Spring shopping alert: you spent €280 on Shopping this month.',             true,  '2026-03-26 12:00:00', 2),
  -- February 2026
  (24, 'Recurring transaction "Monthly salary" has been applied automatically.',    true,  '2026-02-01 06:00:00', 2),
  (25, 'Freelance income of €400 added to your account.',                           true,  '2026-02-20 14:00:00', 2),
  -- January 2026
  (26, 'Recurring transaction "Monthly salary" has been applied automatically.',    true,  '2026-01-01 06:00:00', 2),
  (27, 'Doctor visit expense of €200 recorded.',                                    true,  '2026-01-20 15:00:00', 2);

SELECT setval(pg_get_serial_sequence('notifications', 'id'), (SELECT MAX(id) FROM notifications));
