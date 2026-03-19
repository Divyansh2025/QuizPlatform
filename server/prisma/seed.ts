import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@quizai.com' },
    update: {},
    create: {
      email: 'demo@quizai.com',
      username: 'DemoUser',
      password: hashedPassword,
    },
  });

  // Seed quizzes
  const quizzes = [
    {
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of core JavaScript concepts including closures, prototypes, and async programming.',
      category: 'Programming',
      difficulty: 'medium',
      timeLimit: 30,
      questions: [
        {
          text: 'What is the output of typeof null in JavaScript?',
          options: JSON.stringify(['"null"', '"undefined"', '"object"', '"boolean"']),
          correctAnswer: 2,
          explanation: 'typeof null returns "object" - this is a well-known bug in JavaScript that has persisted for backward compatibility.',
        },
        {
          text: 'Which method creates a new array with the results of calling a function on every element?',
          options: JSON.stringify(['forEach()', 'map()', 'filter()', 'reduce()']),
          correctAnswer: 1,
          explanation: 'map() creates a new array populated with the results of calling a provided function on every element.',
        },
        {
          text: 'What is a closure in JavaScript?',
          options: JSON.stringify([
            'A way to close browser windows',
            'A function bundled with its lexical environment',
            'A method to end loops',
            'A type of error handling',
          ]),
          correctAnswer: 1,
          explanation: 'A closure is the combination of a function and the lexical environment within which it was declared.',
        },
        {
          text: 'What does the "===" operator do?',
          options: JSON.stringify([
            'Assignment',
            'Loose equality comparison',
            'Strict equality comparison',
            'Type coercion',
          ]),
          correctAnswer: 2,
          explanation: 'The === operator checks for strict equality, comparing both value and type without type coercion.',
        },
        {
          text: 'Which keyword is used to declare a block-scoped variable?',
          options: JSON.stringify(['var', 'let', 'const', 'Both let and const']),
          correctAnswer: 3,
          explanation: 'Both let and const declare block-scoped variables. var is function-scoped.',
        },
        {
          text: 'What is the event loop in JavaScript?',
          options: JSON.stringify([
            'A for loop for events',
            'A mechanism that handles async callbacks',
            'A DOM event handler',
            'A type of promise',
          ]),
          correctAnswer: 1,
          explanation: 'The event loop is a mechanism that processes the callback queue and manages asynchronous operations.',
        },
        {
          text: 'What does Promise.all() do?',
          options: JSON.stringify([
            'Resolves when the first promise resolves',
            'Resolves when all promises resolve, rejects if any reject',
            'Always resolves regardless of promise results',
            'Runs promises sequentially',
          ]),
          correctAnswer: 1,
          explanation: 'Promise.all() takes an array of promises and resolves when all of them resolve, or rejects if any one rejects.',
        },
        {
          text: 'What is the purpose of the spread operator (...)?',
          options: JSON.stringify([
            'To create errors',
            'To expand iterables into individual elements',
            'To delete properties',
            'To compare objects',
          ]),
          correctAnswer: 1,
          explanation: 'The spread operator expands an iterable into individual elements, useful for arrays and objects.',
        },
      ],
    },
    {
      title: 'React Mastery',
      description: 'Challenge yourself with advanced React concepts including hooks, context, and performance optimization.',
      category: 'Programming',
      difficulty: 'hard',
      timeLimit: 45,
      questions: [
        {
          text: 'What is the primary purpose of React.memo()?',
          options: JSON.stringify([
            'To create memos in the app',
            'To prevent unnecessary re-renders of components',
            'To manage state',
            'To handle side effects',
          ]),
          correctAnswer: 1,
          explanation: 'React.memo() is a higher-order component that memoizes the result, preventing re-renders when props haven\'t changed.',
        },
        {
          text: 'Which hook should be used for side effects in React?',
          options: JSON.stringify(['useState', 'useEffect', 'useRef', 'useMemo']),
          correctAnswer: 1,
          explanation: 'useEffect is designed for performing side effects like API calls, subscriptions, and DOM manipulation.',
        },
        {
          text: 'What is the purpose of useCallback?',
          options: JSON.stringify([
            'To call back a server',
            'To memoize functions to prevent unnecessary re-creation',
            'To handle errors',
            'To manage routing',
          ]),
          correctAnswer: 1,
          explanation: 'useCallback returns a memoized version of a callback that only changes if its dependencies change.',
        },
        {
          text: 'What is the Context API used for?',
          options: JSON.stringify([
            'Styling components',
            'Database management',
            'Sharing state across components without prop drilling',
            'Handling HTTP requests',
          ]),
          correctAnswer: 2,
          explanation: 'The Context API provides a way to pass data through the component tree without manually passing props at every level.',
        },
        {
          text: 'What does the useRef hook return?',
          options: JSON.stringify([
            'A state variable',
            'A mutable ref object with a .current property',
            'A callback function',
            'An effect cleanup function',
          ]),
          correctAnswer: 1,
          explanation: 'useRef returns a mutable ref object whose .current property persists across renders without causing re-renders.',
        },
        {
          text: 'What is React Suspense used for?',
          options: JSON.stringify([
            'Error handling',
            'Displaying fallback content while waiting for async operations',
            'State management',
            'Routing',
          ]),
          correctAnswer: 1,
          explanation: 'Suspense lets you display a fallback while waiting for something to load, like lazy-loaded components or data.',
        },
      ],
    },
    {
      title: 'Python Essentials',
      description: 'Explore fundamental Python concepts from data structures to object-oriented programming.',
      category: 'Programming',
      difficulty: 'easy',
      timeLimit: 25,
      questions: [
        {
          text: 'Which data structure uses key-value pairs in Python?',
          options: JSON.stringify(['List', 'Tuple', 'Dictionary', 'Set']),
          correctAnswer: 2,
          explanation: 'Dictionaries store data in key-value pairs and are one of Python\'s most versatile data structures.',
        },
        {
          text: 'What is a list comprehension?',
          options: JSON.stringify([
            'A way to understand lists',
            'A concise way to create lists based on existing iterables',
            'A list sorting method',
            'A debugging tool',
          ]),
          correctAnswer: 1,
          explanation: 'List comprehensions provide a concise way to create lists using a single line of code with an expression and loop.',
        },
        {
          text: 'What does the "self" parameter refer to in a class method?',
          options: JSON.stringify([
            'The class itself',
            'The current instance of the class',
            'A global variable',
            'The parent class',
          ]),
          correctAnswer: 1,
          explanation: '"self" refers to the current instance of the class and is used to access instance attributes and methods.',
        },
        {
          text: 'Which keyword is used to handle exceptions in Python?',
          options: JSON.stringify(['catch', 'except', 'handle', 'error']),
          correctAnswer: 1,
          explanation: 'Python uses try/except blocks for exception handling, unlike Java/C# which use try/catch.',
        },
        {
          text: 'What is a decorator in Python?',
          options: JSON.stringify([
            'A design pattern for UI',
            'A function that modifies the behavior of another function',
            'A type of variable',
            'A loop construct',
          ]),
          correctAnswer: 1,
          explanation: 'Decorators are functions that take another function and extend its behavior without modifying it directly.',
        },
      ],
    },
    {
      title: 'Data Science & Machine Learning',
      description: 'Test your understanding of ML algorithms, statistics, and data science concepts.',
      category: 'Data Science',
      difficulty: 'hard',
      timeLimit: 40,
      questions: [
        {
          text: 'What is overfitting in machine learning?',
          options: JSON.stringify([
            'When a model is too simple',
            'When a model performs well on training data but poorly on new data',
            'When there is too much training data',
            'When the learning rate is too low',
          ]),
          correctAnswer: 1,
          explanation: 'Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize.',
        },
        {
          text: 'Which algorithm is commonly used for classification tasks?',
          options: JSON.stringify(['Linear Regression', 'Random Forest', 'K-Means', 'PCA']),
          correctAnswer: 1,
          explanation: 'Random Forest is an ensemble classification algorithm that builds multiple decision trees and merges their results.',
        },
        {
          text: 'What does the term "gradient descent" refer to?',
          options: JSON.stringify([
            'A type of neural network',
            'An optimization algorithm to minimize a loss function',
            'A data preprocessing step',
            'A model evaluation metric',
          ]),
          correctAnswer: 1,
          explanation: 'Gradient descent is an optimization algorithm that iteratively adjusts parameters to minimize the loss function.',
        },
        {
          text: 'What is the purpose of cross-validation?',
          options: JSON.stringify([
            'To increase training speed',
            'To assess how a model generalizes to independent data sets',
            'To visualize data',
            'To clean the dataset',
          ]),
          correctAnswer: 1,
          explanation: 'Cross-validation evaluates model performance by training and testing on different subsets of the data.',
        },
        {
          text: 'What is a confusion matrix?',
          options: JSON.stringify([
            'A matrix that confuses the model',
            'A table showing TP, TN, FP, FN for classification results',
            'A type of neural network layer',
            'A feature selection method',
          ]),
          correctAnswer: 1,
          explanation: 'A confusion matrix summarizes classification results showing True/False Positives/Negatives.',
        },
      ],
    },
    {
      title: 'System Design Basics',
      description: 'Explore core system design concepts including scalability, caching, and distributed systems.',
      category: 'System Design',
      difficulty: 'medium',
      timeLimit: 35,
      questions: [
        {
          text: 'What is horizontal scaling?',
          options: JSON.stringify([
            'Adding more RAM to a server',
            'Adding more machines to handle increased load',
            'Upgrading the CPU',
            'Using a faster database',
          ]),
          correctAnswer: 1,
          explanation: 'Horizontal scaling (scaling out) adds more machines to distribute load, as opposed to vertical scaling.',
        },
        {
          text: 'What is the CAP theorem?',
          options: JSON.stringify([
            'A way to cap API requests',
            'States that distributed systems can only guarantee 2 of: Consistency, Availability, Partition tolerance',
            'A caching strategy',
            'A load balancing algorithm',
          ]),
          correctAnswer: 1,
          explanation: 'The CAP theorem states that a distributed data store can only provide 2 of 3 guarantees simultaneously.',
        },
        {
          text: 'What is a CDN (Content Delivery Network)?',
          options: JSON.stringify([
            'A type of database',
            'A distributed network of servers that delivers content based on geographic location',
            'A coding framework',
            'A security protocol',
          ]),
          correctAnswer: 1,
          explanation: 'CDNs cache content on edge servers worldwide, reducing latency by serving content from the nearest server.',
        },
        {
          text: 'What is the purpose of a load balancer?',
          options: JSON.stringify([
            'To store data',
            'To distribute incoming traffic across multiple servers',
            'To encrypt data',
            'To compile code',
          ]),
          correctAnswer: 1,
          explanation: 'Load balancers distribute incoming network traffic across multiple servers to ensure high availability.',
        },
        {
          text: 'What caching strategy updates the cache on write operations?',
          options: JSON.stringify([
            'Cache-aside',
            'Write-through',
            'Read-through',
            'Write-back',
          ]),
          correctAnswer: 1,
          explanation: 'Write-through caching updates both the cache and the database simultaneously on every write operation.',
        },
      ],
    },
    {
      title: 'General Knowledge: Science',
      description: 'A fun science quiz covering physics, chemistry, biology, and astronomy.',
      category: 'Science',
      difficulty: 'easy',
      timeLimit: 20,
      questions: [
        {
          text: 'What is the chemical symbol for gold?',
          options: JSON.stringify(['Go', 'Gd', 'Au', 'Ag']),
          correctAnswer: 2,
          explanation: 'Au comes from the Latin word "aurum," meaning gold.',
        },
        {
          text: 'What planet is known as the Red Planet?',
          options: JSON.stringify(['Venus', 'Mars', 'Jupiter', 'Saturn']),
          correctAnswer: 1,
          explanation: 'Mars appears red due to iron oxide (rust) on its surface.',
        },
        {
          text: 'What is the powerhouse of the cell?',
          options: JSON.stringify(['Nucleus', 'Ribosome', 'Mitochondria', 'Endoplasmic Reticulum']),
          correctAnswer: 2,
          explanation: 'Mitochondria generate most of the cell\'s supply of ATP, the energy currency of the cell.',
        },
        {
          text: 'What is the speed of light approximately?',
          options: JSON.stringify(['300,000 m/s', '300,000 km/s', '300,000 mph', '300,000 km/h']),
          correctAnswer: 1,
          explanation: 'Light travels at approximately 299,792 km/s (about 300,000 km/s) in a vacuum.',
        },
        {
          text: 'Which gas makes up most of Earth\'s atmosphere?',
          options: JSON.stringify(['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen']),
          correctAnswer: 2,
          explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere, while oxygen is about 21%.',
        },
      ],
    },
  ];

  for (const quizData of quizzes) {
    const { questions, ...quiz } = quizData;
    await prisma.quiz.create({
      data: {
        ...quiz,
        createdById: user.id,
        questions: {
          create: questions,
        },
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`   Created user: demo@quizai.com / demo123`);
  console.log(`   Created ${quizzes.length} quizzes`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
