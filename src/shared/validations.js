export function isEmpty(value) {
  return value === "" || value === undefined || value === null;
}

export function validateLogin(username, password) {
  const errors = {};
  if (isEmpty(username)) {
    errors["username"] = "Preencha o usuário";
  }
  if (isEmpty(password)) {
    errors["password"] = "Preencha a senha";
  }

  return errors;
}
