Welcome to the Blogging Platform—an engaging web app where you can unleash your creativity and manage your personal blog posts with ease. Built on a robust tech stack that includes Node.js, Express, MongoDB, and EJS, this platform is designed for simplicity, security, and an optimal user experience.

## 📜 Features at a Glance

### Home Page

The homepage serves as a dynamic feed, showcasing all blog posts in reverse chronological order. Readers can enjoy the latest content at the top, making it easy to stay updated.

### MongoDB Integration

We've transitioned to MongoDB for a more flexible, NoSQL database solution. This change enhances scalability and performance, allowing for more efficient data management.

### Deployment on Render

Our platform is now deployed on Render, providing a reliable and scalable hosting solution for both the server and database.

### Create New Post

Starting a new post is simple! Add essential details like your name, email, enrollment (if applicable), and the post content. You can set a unique password to ensure only you have editing control.

### Edit Post

Made a typo or have updates? No problem. With the correct password, you can quickly edit any post, keeping your content fresh and relevant.

### Delete Post

For times when you need a clean slate, delete any post securely using your password, protecting your blog from unauthorized changes.

### Dynamic Views with EJS

Using EJS templates, each page is rendered dynamically for faster loads and a responsive, modern look.

## 🛠️ Tech Stack

- **Node.js**: Powering the backend, handling requests, and managing server operations.
- **Express**: A web framework for Node.js, making it easy to set up routing and middleware.
- **MongoDB**: A NoSQL database that securely stores and organizes blog posts.
- **EJS**: A template engine allowing dynamic HTML rendering for smooth page transitions and an enhanced user experience.
- **UUID**: Generates unique IDs for each blog post, providing consistency and security.
- **Render**: Hosts the server and database for fast and scalable performance.

## 📂 Project Structure

Here's a quick look at the project's organized file structure:

```plaintext
.
├── index.js             # Main server file with route handling
├── schema.sql           # SQL script for database and table creation
├── views/               # EJS templates
│   ├── home.ejs
│   ├── adduser.ejs
│   ├── edit.ejs
│   ├── delete.ejs
│   └── prompt.ejs
├── public/              # Static assets (CSS, images)
└── README.md            # Project documentation
```

## 🌐 Routes Overview

- **GET /** - **Home Page**: Displays all posts.
- **GET /add-user** - **Add Post**: Page to create a new blog post.
- **POST /add-user** - **Save Post**: Endpoint to save a new blog post.
- **GET /user/:id** - **Edit Post**: Page to edit a post.
- **POST /update/:id** - **Update Post**: Endpoint to save edits to a post.
- **POST /delete/:id** - **Delete Post**: Securely delete a post with password verification.

## 🚀 Deployment

### Database Deployment on Render

1. Go to your Render dashboard and create a new project.
2. Add MongoDB as a service and configure your database credentials.
3. Connect your GitHub repository to Render and deploy.

### Server Deployment on Render

1. Navigate to Render and create a new project.
2. Link your GitHub repository, configure any necessary environment variables, and deploy your server.

## 🛠 Installation

### Clone the Repository:

```bash
git clone https://github.com/viren-kevat/blog_veer.git
cd blogging-platform
```

## 👩‍💻 About the Developer

Hello! I’m Virenkumar, a passionate tech enthusiast and student at Government Engineering College Modasa, pursuing a Bachelor of Engineering in Information Technology. This project showcases my interest in web development and building user-friendly platforms.
