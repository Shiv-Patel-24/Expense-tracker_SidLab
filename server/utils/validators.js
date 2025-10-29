import validator from "validator";

export const validateEmail = (email) => validator.isEmail(email);

export const validatePassword = (password) => password && password.length >= 6;

export const validateAmount = (amount) => !isNaN(amount) && amount >= 0;

export const sanitizeInput = (input) => validator.escape(input.trim());
