"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { fetchListItems } from "@/app/api/servercalls";

interface ListItem {
  id: number;
  name: string;
  completed: boolean;
  created_at?: string;
}

interface ListProps {
  userId: string;
}

export default function List({ userId }: ListProps) {
  const [items, setItems] = useState<ListItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Fetch items on component mount
  useEffect(() => {
    loadItems();
  }, [userId]);

  async function loadItems() {
    try {
      const items = await fetchListItems(userId);
      if (items) {
        setItems(items);
      }
    } catch (error) {
      console.error("Error fetching grocery items:", error);
    } finally {
      setLoading(false);
    }
  }

  const checkDuplicate = (newItemText: string, existingItems: ListItem[]) => {
    const trimmedNew = newItemText.trim().toLowerCase();

    const duplicate = existingItems.find((item) => {
      const existingName = item.name.toLowerCase();
      return existingName.includes(trimmedNew) || trimmedNew.includes(existingName);
    });

    return duplicate ? `Similar item "${duplicate.name}" already exists!` : null;
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedItem = newItem.trim();
    if (trimmedItem) {
      try {
        // Check for similar items
        const duplicateError = checkDuplicate(trimmedItem, items);
        if (duplicateError) {
          setError(duplicateError);
          return;
        }

        const newItem = {
          owner_id: userId,
          name: trimmedItem,
          completed: false,
        };

        const { data, error } = await supabase
          .from("curated_list_items")
          .insert([newItem])
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setItems([data, ...items]);
        }
        setNewItem("");
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const deleteItem = async (id: number) => {
    try {
      // Delete from Supabase
      const { error } = await supabase.from("curated_list_items").delete().eq("id", id);

      if (error) throw error;

      // Remove from local state
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading) {
    return <div className="max-w-md mx-auto p-4 text-center">Loading list...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h3 className="flex text-gray-500 text-1x font-semibold mb-1 items-center justify-center">
        Total Items: {items.length}
      </h3>
      <form onSubmit={addItem} className="flex flex-col gap-2 mb-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add an item..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 p-2 border rounded-lg transition-all duration-300"
          >
            <input
              type="checkbox"
              onChange={() => deleteItem(item.id)}
              className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
            />
            <span
              onClick={() => deleteItem(item.id)}
              className="text-black cursor-pointer hover:text-blue-600 flex-1 flex justify-between items-center"
            >
              {item.name}
              <span className="text-xs text-gray-500">
                {new Date(item.created_at!).toLocaleString()}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p className="text-center text-black mt-4">This list is empty. Add some items!</p>
      )}
    </div>
  );
}
