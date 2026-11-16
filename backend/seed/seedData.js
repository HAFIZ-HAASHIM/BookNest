/**
 * Sample Book & Order Seed Data
 * 
 * Pre-populated realistic records for college demonstration and testing.
 */

const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Literature',
    price: 14.99,
    quantity: 25,
  },
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Technology',
    price: 38.50,
    quantity: 12,
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    price: 19.99,
    quantity: 18,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    price: 12.50,
    quantity: 15,
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Technology',
    price: 45.00,
    quantity: 8,
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    price: 16.75,
    quantity: 10,
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Business',
    price: 18.25,
    quantity: 20,
  },
  {
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    category: 'Technology',
    price: 29.99,
    quantity: 3, // Low stock for testing alert badge!
  },
  {
    title: '1984',
    author: 'George Orwell',
    category: 'Fiction',
    price: 11.95,
    quantity: 2, // Low stock
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Business',
    price: 21.00,
    quantity: 14,
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    price: 22.50,
    quantity: 16,
  },
  {
    title: 'Algorithms Unlocked',
    author: 'Thomas H. Cormen',
    category: 'Technology',
    price: 32.00,
    quantity: 0, // Out of stock for testing out-of-stock badge and order blocking!
  },
];

module.exports = { sampleBooks };
