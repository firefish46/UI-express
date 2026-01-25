"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveComponent(data: { title: string, author: string, category: string, html: string, css: string }) {
  try {
    const newComponent = await db.uIComponent.create({
      data: {
        title: data.title || "Untitled",
        author: data.author || "Anonymous",
        category: data.category,
        html: data.html,
        css: data.css,
      },
    });

    // This tells Next.js to update the homepage so the new component appears instantly
    revalidatePath("/"); 
    
    return { success: true, id: newComponent.id };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to save to database" };
  }
}