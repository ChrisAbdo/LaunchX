"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

let sessionCache: any = null;

async function getSession() {
  if (!sessionCache) {
    sessionCache = await getServerSession(authOptions);
  }
  return sessionCache;
}

export async function addPost(formData: FormData) {
  const session = await getSession();
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));
  const githubUrl = String(formData.get("githubUrl"));
  const siteUrl = String(formData.get("siteUrl"));
  const framework = String(formData.get("framework"));

  const coverImg = String(formData.get("coverImg"));
  const authorId = session?.user.id;

  try {
    await prisma.post.create({
      data: {
        title,
        description,
        githubUrl,
        siteUrl,
        framework,
        coverImg,
        authorId,
      },
    });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
  revalidatePath("/");
  redirect("/");
}

export async function addComment(formData: FormData) {
  const session = await getSession();
  const postId = String(formData.get("postId"));
  const body = String(formData.get("body"));
  const authorId = session?.user.id;

  try {
    await prisma.comment.create({
      data: {
        postId,
        body,
        authorId,
      },
    });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
  revalidatePath(`/project/${postId}`);
}

export async function upvotePost(postId: string) {
  // Try to get the session
  const session = await getSession();

  // If there's no session, the user is not logged in
  if (!session) {
    throw new Error("You must be logged in to upvote a post.");
  }

  const userId = session.user.id; // Assuming session structure contains user object with an id

  try {
    // Check if the user already upvoted the post
    const existingUpvote = await prisma.postUpvote.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (existingUpvote) {
      // If the user already upvoted, remove the upvote
      await prisma.postUpvote.delete({
        where: {
          id: existingUpvote.id, // Use the appropriate unique identifier for your upvote record
        },
      });

      // Return a message indicating the upvote was removed
      revalidatePath(`/projects/project/${postId}`);
      return { message: "Upvote removed successfully." };
    } else {
      // If not, create a new upvote in the database
      await prisma.postUpvote.create({
        data: {
          postId: postId,
          userId: userId,
        },
      });

      // Return a message indicating the upvote was successful
      revalidatePath(`/projects/project/${postId}`);
      return { message: "Successfully upvoted the post." };
    }
  } catch (error: any) {
    // Handle or throw errors from the database
    return {
      error: error.message,
    };
  }
}

export async function checkIfUserUpvoted(postId: string) {
  // Try to get the session
  const session = await getSession();

  // If there's no session, the user is not logged in; return false since we can't check the upvote status
  if (!session) {
    return false;
  }

  const userId = session.user.id; // Assuming session structure contains user object with an id

  try {
    // Check if the user already upvoted the post
    const existingUpvote = await prisma.postUpvote.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    // If there is an existing upvote, return true indicating this user has upvoted the post
    return Boolean(existingUpvote);
  } catch (error: any) {
    // Log the error and return false as we couldn't verify the upvote status
    console.error("An error occurred while checking the upvote status:", error);
    return false;
  }
}
