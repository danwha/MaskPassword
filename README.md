
# Masked Password

## convert to class 20210116

## added 20210115
  1. There were complaints that it was not encrypted. Encrypted.
  2. There was a complaint that the server administrator could know the password rules. I've tried.

## why - Many services require the following:
  1. Don't use passwords that are easy to remember.
  2. The length of the password is increasing.
  3. Mix letters, numbers and symbols.
  4. Require periodic changes.
  5. The demanding rules get more complicated.

## as results
  1. It's hard to remember.
  2. Despite its complexity, password leaks are common.
  3. Complex rules don't prevent leaks, but they are good for users to forget.

## suggestion
  1. It has as set format that is easy to remember.
  2. It has to change itself.

## then
  1. Contains custom strings.
  2. It includes the year, month, day, week, and time set by the user.
  3. User can change the order.
  4. If necessary, additional encryption can be added.

## example
  1. fixed string : danwha
  2. Month name associated with the month
  3. fixed string : -
  4. Current hour

  If today is January 8, 2021 at 22:00, the correct password is danwhaJAN-22.

  If today is August 18, 2021 09:00, the correct password is danwhaAUG-09.

## usage
  1. SIMPLE!

## If this has helped
  ### I think I can do better if I eat chicken.
  ETH Wallet : 0x03AA0D76BE8f547244c5A7410674f400142305b0
