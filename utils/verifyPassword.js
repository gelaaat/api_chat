import bcrypt from 'bcrypt'

export const verifyPassword = (user, password) => {
  const { hash } = user
  const varified = bcrypt.compareSync(password, hash)
  return varified
}
