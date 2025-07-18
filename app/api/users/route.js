import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const { type, username, email, password, role } = body;

  // 🟣 REGISTER
  if (type === "register") {
    if (!username || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return new Response(JSON.stringify({ message: "User registered", user: newUser }), {
      status: 201,
    });
  }

  // 🟢 LOGIN
  if (type === "login") {
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    console.log(user)

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "Login successful", user }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ error: "Invalid request type" }), {
    status: 400,
  });
}
