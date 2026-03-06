alter table "user" rename column email to login;
alter index user_email_key rename to user_login_key;