package com.cashy.util;

import lombok.*;

@Data
public class Constant {

    public static final String PAYMENT_METHODS_PATH = "/api/payment-methods";
    public static final String NOTIFICATIONS_PATH = "/api/notifications";
    public static final String ANALYTICS_PATH = "/api/analytics";
    public static final String BUDGETS_PATH = "/api/budgets";
    public static final String CATEGORIES_PATH = "/api/categories";
    public static final String AUTH_PATH = "/api/auth";
    public static final String DAILY_BUDGETS_PATH = "/api/daily-budgets";
    public static final String DASHBOARDS_PATH = "/api/dashboard";
    public static final String GOALS_PATH = "/api/goals";
    public static final String RECURRING_TRANSACTIONS_PATH = "/api/recurring-transactions";
    public static final String TRANSACTIONS_PATH = "/api/transactions";
    public static final String USERS_PATH = "/api/users";


    public static final String ID_PATH = "/{id}";
    public static final String UNREAD_COUNT = "/unread-count";
    public static final String MARK_AS_READ_PATH = "/{id}/read";
    public static final String READ_ALL_PATH = "/read-all";
    public static final String MONTHLY_PATH = "/monthly";
    public static final String BY_CATEGORY_PATH = "/by-category";
    public static final String REGISTER_PATH = "/register";
    public static final String LOGIN_PATH = "/login";
    public static final String SUMMARY_PATH = "/summary";
    public static final String FUNDS_PATH = "/{id}/funds";
    public static final String APPLY_PATH = "/{id}/apply";
    public static final String ME_PATH = "/me";
    public static final String USERNAME_PATH = "/me/username";
    public static final String PASSWORD_PATH = "/me/password";


}
