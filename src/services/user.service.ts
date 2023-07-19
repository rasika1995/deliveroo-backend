import Users from '../models/user.model';

export async function createNewUser(userData: Partial<Users>) {
  try {
    const user = Users.build(userData);
    await user.hashPassword(); // Hash the password before saving
    const newUser = await user.save();
    return newUser;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function findUserByEmail(email: string) {
  try {
    return await Users.findOne({ where: { email } });
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Internal server error');
  }
}
