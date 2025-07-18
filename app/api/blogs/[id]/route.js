import mongoose from "mongoose";
import { connectDB } from "../../../../lib/db";
import Blog from "../../../../models/blog";

export async function GET(req, context) {
  const { params } = context;
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid blog ID" }), {
      status: 400,
    });
  }

  await connectDB(); // ✅ Safe to do now

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(blog), { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs/[id] error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch blog" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, context) {
  const { params } = context;
  const { id } = params;

  console.log(id)
  // ✅ Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid blog ID" }), {
      status: 400,
    });
  }

  await connectDB();

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), {
        status: 404,
      });
    }

    console.log(deletedBlog)

    return new Response(JSON.stringify({ message: "Blog deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("DELETE /api/blogs/[id] error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete blog" }), {
      status: 500,
    });
  }
}


export async function PUT(req, context) {
  const { params } = context;
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid blog ID" }), {
      status: 400,
    });
  }

  await connectDB();

  const body = await req.json();
  const { title, content, authorName } = body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        authorName,
        updatedAt: new Date(),
      },
      { new: true } // return the updated document
    );

    if (!updatedBlog) {
      return new Response(JSON.stringify({ error: "Blog not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Blog updated successfully", blog: updatedBlog }), {
      status: 200,
    });
  } catch (error) {
    console.error("PUT /api/blogs/[id] error:", error);
    return new Response(JSON.stringify({ error: "Failed to update blog" }), {
      status: 500,
    });
  }
}
