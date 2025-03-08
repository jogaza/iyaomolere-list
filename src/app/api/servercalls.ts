import { supabase } from "@/lib/supabase";

// Add this function to fetch the user's full name
export async function getUserFullName(uuid: string): Promise<string | null> {
  try {
    // Assuming you have a profiles table with user information
    const { data } = await supabase
      .from("curated_list_users")
      .select("id, first_name, last_name, curated_list_items(id, name, completed, created_at)")
      .eq("clerk_id", uuid)
      .order("created_at", { ascending: false });

    if (!data || !data[0]) {
      // If no data or no first_name, return a default value
      return null;
    }
    if (data[0].first_name && data[0].last_name) {
      let fullName = `${data[0].first_name} ${data[0].last_name}`;
      return fullName;
    } else {
      return "Curated";
    }
  } catch (error) {
    console.error("Unexpected error fetching user:", error);
    return null;
  }
}

export async function fetchListItems(userId: string) {
  try {
    const { data, error } = await supabase
      .from("curated_list_users")
      .select("id, first_name, last_name, curated_list_items(id, name, completed, created_at)")
      .eq("clerk_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (data && data[0]?.curated_list_items) {
      return data[0]?.curated_list_items;
    }
  } catch (error) {
    console.error("Error fetching list items:", error);
  }
}
