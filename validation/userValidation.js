function validatePassword(password, minlength) {
  if (!password.trim()) return "insert password";
  if (password.length < minlength) {
    return `password must has at least ${minlength} characters`;
  }

  const hasCapitalLetter = /[A-Z]/g;
  if (!hasCapitalLetter.test(password)) {
    return "insert at least 1 capital letter";
  }

  const hasNumber = /\d/g;
  if (!hasNumber.test(password)) {
    return "insert at least 1 number";
  }

  return "";
}

function validateEmail(email) {
  if (!email.trim()) return "insert email";

  const isValidEmail = /^\S+@\S+$/g;
  if (!isValidEmail.test(email)) {
    return "email is not valid";
  }

  return "";
}

function validateName(name, fieldName, minlength) {
  if (!name.trim()) return `insert ${fieldName}`;

  if (name.length < minlength)
    return `${fieldName} can't have less than ${minlength} characters`;

  return "";
}

function validateUsername(username) {
  if (!username.trim()) return "insert username";

  const isValidUsername = /^[a-z0-9_-]{3,15}$/;
  if (!isValidUsername.test(username)) return "username is not valid";

  return "";
}

function validatePhone(phone) {
  if (!phone.trim()) return "insert phone number";

  const isValidatePhone = /^(0|0098|\+98)9(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/;
  if (!isValidatePhone.test(phone)) return "phone number is not valid";

  return "";
}

export {
  validatePassword,
  validateEmail,
  validateName,
  validateUsername,
  validatePhone,
};
