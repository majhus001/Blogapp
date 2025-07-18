import { connectDB } from "../../../lib/db";
import Blog from "../../../models/blog";

// Create a new blog
export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { title, content, authorId, authorName, category, tags, isPublished } = body;

  if (!title || !content || !authorId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const newBlog = await Blog.create({
    title,
    content,
    authorId,
    authorName,
    category,
    tags,
    isPublished,
  });

  return new Response(JSON.stringify({ message: "Blog created", blog: newBlog }), {
    status: 201,
  });
}

// Get all blogs
export async function GET() {
  await connectDB();

  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // recent first
    console.log(blogs)
    return new Response(JSON.stringify(blogs), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch blogs" }), {
      status: 500,
    });
  }
}


