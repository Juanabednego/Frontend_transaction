// Mock user database for demo purposes
export const users = [
  {
    id: 1,
    username: 'user',
    password: 'user123',
    role: 'user',
    name: 'John Doe'
  },
  {
    id: 2,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin'
  }
]

export function findUser(username, password) {
  return users.find(u => u.username === username && u.password === password)
}
