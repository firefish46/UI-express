"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Updates the like count for a specific component.
 * Handles the case where 'likes' might be null in the database.
 */
export async function toggleLikeAction(id: string, currentIsLiked: boolean) {
  try {
    // 1. Fetch current component to handle potential 'null' likes
    const component = await db.uIComponent.findUnique({
      where: { id },
      select: { likes: true }
    });

    // Treat null as 0
    const currentLikes = component?.likes ?? 0;

    // 2. Update the record
    await db.uIComponent.update({
      where: { id },
      data: {
        likes: currentIsLiked 
          ? Math.max(0, currentLikes - 1) // Prevent negative likes
          : currentLikes + 1,
      },
    });
    
    // 3. Purge the cache so the UI reflects the new count
    revalidatePath(`/view/${id}`);
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Database Error (Like):", error);
    return { success: false };
  }
}

/**
 * Saves a new UI component to MongoDB.
 * Returns a result object to trigger the success modal in the UI.
 */
export async function saveComponent(formData: {
  title: string;
  author: string;
  category: string;
  html: string;
  css: string;
}) {
  try {
    // 1. Basic Server-side Validation
    if (!formData.title || !formData.author || !formData.html) {
      return { success: false, error: "Please fill in all required fields." };
    }

    // 2. Create the record in MongoDB
    const newComponent = await db.uIComponent.create({
      data: {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        html: formData.html,
        css: formData.css,
        likes: 0, // Ensure likes start at 0, not null
      },
    });

    // 3. Clear the homepage cache so the new item shows up
    revalidatePath("/");

    return { 
      success: true, 
      id: newComponent.id 
    };
  } catch (error: unknown) {
    console.error("Database Error (Save):", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred while saving." 
    };
  }
}