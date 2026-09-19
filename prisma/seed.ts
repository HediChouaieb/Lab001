import { PrismaClient, UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.evidence.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.message.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.borrowing.deleteMany();
  await prisma.libraryCard.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
  await prisma.auditLog.deleteMany();

  const password = await bcrypt.hash('password123', 4);
  const adminPassword = await bcrypt.hash('admin123', 4);

  // Create 30 users
  const users = [];
  for (let i = 1; i <= 30; i++) {
    const user = await prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `user${i}@example.test`,
        phone: `+216${faker.string.numeric(8)}`,
        dateOfBirth: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
        address: `${faker.location.buildingNumber()} ${faker.location.street()}, ${faker.location.city()}, Tunisia`,
        password: password,
        role: UserRole.MEMBER,
      },
    });
    users.push(user);
  }

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Carthage',
      email: 'admin@example.test',
      phone: '+21670000000',
      dateOfBirth: new Date('1985-01-15'),
      address: '123 Avenue de Carthage, Tunis, Tunisia',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });
  users.push(adminUser);

  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.test',
      phone: '+21690000000',
      dateOfBirth: new Date('1990-06-20'),
      address: '45 Rue de la Liberte, Sfax, Tunisia',
      password: await bcrypt.hash('password123', 4),
      role: UserRole.MEMBER,
    },
  });
  users.push(demoUser);

  // Create library cards
  for (let i = 0; i < 30; i++) {
    await prisma.libraryCard.create({
      data: {
        cardNumber: `CAR-2026-${String(1000 + i).padStart(4, '0')}`,
        userId: users[i].id,
        status: 'ACTIVE',
        issuedAt: faker.date.past({ years: 1 }),
        expiresAt: faker.date.future({ years: 2 }),
      },
    });
  }

  // Create 100 books
  const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Art', 'Philosophy', 'Children', 'Reference', 'Periodicals'];
  const books = [];
  for (let i = 1; i <= 100; i++) {
    const book = await prisma.book.create({
      data: {
        title: faker.lorem.words({ min: 2, max: 6 }),
        author: faker.person.fullName(),
        category: faker.helpers.arrayElement(categories),
        isbn: `978-${faker.string.numeric(3)}-${faker.string.numeric(4)}-${faker.string.numeric(1)}-${faker.string.numeric(1)}`,
        description: faker.lorem.paragraph(),
        totalCopies: faker.number.int({ min: 1, max: 5 }),
        available: faker.number.int({ min: 0, max: 5 }),
        imageUrl: `/books/${i}.jpg`,
      },
    });
    books.push(book);
  }

  // Create 30 borrowings
  for (let i = 0; i < 30; i++) {
    const user = users[i % users.length];
    const book = books[i % books.length];
    await prisma.borrowing.create({
      data: {
        userId: user.id,
        bookId: book.id,
        borrowedAt: faker.date.past({ years: 0.5 }),
        dueDate: faker.date.future({ years: 0.1 }),
        returnedAt: faker.number.float({ min: 0, max: 1 }) > 0.5 ? faker.date.past() : null,
        status: faker.helpers.arrayElement(['BORROWED', 'RETURNED', 'OVERDUE']),
      },
    });
  }

  // Create 15 announcements
  const announcementTitles = [
    'Summer Reading Program 2026',
    'New Digital Archive Access',
    'Library Hours Extended',
    'Children\'s Story Time',
    'Author Meet & Greet',
    'Book Club Meeting',
    'Digital Literacy Workshop',
    'New Book Collection',
    'Library Card Renewal',
    'Holiday Schedule',
    'Community Event',
    'Volunteer Opportunity',
    'Technology Workshop',
    'Art Exhibition',
    'Tunisian Heritage Month',
  ];

  for (let i = 0; i < 15; i++) {
    await prisma.announcement.create({
      data: {
        title: announcementTitles[i],
        content: faker.lorem.paragraphs(2),
        author: faker.person.fullName(),
        createdAt: faker.date.past({ years: 0.5 }),
      },
    });
  }

  // Create 15 messages
  for (let i = 0; i < 15; i++) {
    await prisma.message.create({
      data: {
        userId: faker.helpers.arrayElement(users).id,
        name: faker.person.fullName(),
        email: faker.internet.email({ provider: 'example.test' }),
        subject: faker.lorem.words({ min: 3, max: 6 }),
        message: faker.lorem.paragraph(),
        createdAt: faker.date.past({ years: 0.2 }),
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
