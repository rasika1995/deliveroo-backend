const faker = require('faker')

import Restaurant from './models/restaurant.model' // Import your Sequelize models

// Seed Restaurants
const seedRestaurants = async (): Promise<void> => {
  try {
    for (let i = 0; i < 10; i++) {
      await Restaurant.create({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        postal_code: faker.address.zipCode(),
        phone: faker.phone.number(),
        website: faker.internet.url(),
      })
    }
    console.log('Restaurants seeded successfully!')
  } catch (error) {
    console.error('Error seeding restaurants:', error)
  }
}

// Call the seed functions
seedRestaurants()
