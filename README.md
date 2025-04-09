# Home24 BXP Frontend Test Task

This is a back-office application that enables businesses to manage a product database. The application is built with React, TypeScript, and Ant Design.

## Features

- User authentication with Firebase
- Product category navigation tree
- Product listing with pagination, sorting, and filtering
- Product details view
- Product attribute management
- Last modified product widget
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Technologies Used

- **React**: UI library (v19.0.0)
- **TypeScript**: Type checking
- **Ant Design**: UI components library
- **React Router**: For navigation (v7.4.1)
- **Firebase**: Authentication
- **JSON Server**: Mock backend API
- **Vite**: Build tool and development server

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/home24-bxp-frontend.git
cd home24-bxp-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up Firebase:

   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Email/Password authentication in the Firebase console
   - Create a web app and copy the Firebase configuration
   - Update the Firebase configuration in `src/firebase/config.ts`
   - Create at least one user in the Firebase Authentication console

4. Start the mock server:

```bash
npx json-server --watch db.json --port 3001
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

### Authentication

- Use the email and password you created in the Firebase console to log in
- For demo purposes, you can use: `demo@home24.de` / `password`

### Navigation

- Use the sidebar to navigate between different sections
- The category tree allows you to view products by category
- Categories filter products by their respective category_id

### Product Management

- View all products or filter by category
- Sort products by different fields (ID, name)
- Navigate through paginated results with 5, 10, 20, or 50 items per page
- View product details by clicking on a product
- Edit product attributes by going to the edit page
- Last modified product is shown in a widget at the top of the page

## Project Structure

```
home24-bxp-frontend/
├── public/               # Public assets
├── src/                  # Source code
│   ├── api/              # API client and service functions
│   ├── components/       # React components
│   │   ├── Auth/         # Authentication related components
│   │   ├── Layout/       # Layout components
│   │   └── Products/     # Product related components
│   ├── context/          # React context providers
│   ├── firebase/         # Firebase configuration
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── tests/            # Test files and mocks
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Utility functions
├── db.json               # Mock database for JSON Server
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Assumptions and Design Decisions

1. **Authentication**: Firebase was chosen for authentication instead of a custom backend implementation for simplicity and security.

2. **Data Structure**: The domain models were extended with additional properties to improve the user experience:

   - Added `type` to `AttributeValue` to support different attribute types
   - Added `label` to `AttributeValue` for better display purposes
   - Added `last_modified` to `Product` to track changes

3. **UI Design**: Ant Design was selected as the UI library for its comprehensive component set and enterprise-focused design.

4. **State Management**: Used React Context for global state (auth, last modified product) and custom hooks for component-specific state.

5. **Backend**: JSON Server is used as a mock backend to simulate a REST API. The database structure uses `category_id` as the property name for relating products to categories.

6. **Build Tool**: Vite is used as the build tool for faster development and optimized production builds.

## Testing

The application includes unit tests written with Jest and React Testing Library. Run the tests with:

```bash
npm test
# or
yarn test
```

For test coverage report:

```bash
npm run test:coverage
# or
yarn test:coverage
```

## Possible Improvements

1. **State Management**: For a larger application, consider using Redux or another state management library.

2. **Form Handling**: Implement more advanced form validation with libraries like Formik or React Hook Form.

3. **Test Coverage**: Increase test coverage for components and services.

4. **Error Handling**: Implement a more robust error handling system with better user feedback.

5. **Localization**: Add support for multiple languages using i18next or similar.

6. **Performance Optimization**: Implement code splitting and lazy loading for larger applications.

7. **Enhanced Security**: Add CSRF protection and more robust authentication checks.

8. **Improved UX**: Add more interactive elements like drag-and-drop for reordering items.

9. **Responsive Enhancements**: Further improve mobile responsiveness.

10. **Accessibility**: Improve accessibility following WCAG guidelines.

## Troubleshooting

- If you encounter issues with category filtering or dashboard display, ensure your JSON Server is properly running and the database is correctly structured with `category_id` properties on product objects.
- Check the browser console for detailed debug logs about API requests and responses.
- Verify that the pagination parameters (`_page` and `_limit`) are correctly handled in the API requests.
- If facing problems with the JSON Server, try restarting it with the explicit command:
  ```bash
  npx json-server --watch db.json --port 3001
  ```
- Make sure your `db.json` file has the correct structure with products that have `category_id` properties matching your categories.
