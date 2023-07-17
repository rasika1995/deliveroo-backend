import Users from '../models/user.model';

export async function createNewUser(name: string, email: string) {
  try {
    const user = await Users.create({ name, email });
    return user;
  } catch (error) {
    console.log(error);
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
