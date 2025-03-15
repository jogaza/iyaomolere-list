"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { fetchListItems } from "@/app/api/servercalls";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

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
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading your list...</span>
      </div>
    );
  }

  return (
    <Card className="max-w-md w-full mx-auto shadow-lg border-accent">
      <CardHeader className="bg-secondary/50">
        <CardTitle className="flex justify-between items-center text-lg pt-2">
          <span className="text-primary">Items</span>
          <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded-full">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <form onSubmit={addItem} className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add an item..."
              className="flex-1"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-secondary hover:bg-secondary/100 text-secondary-foreground"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm"
            >
              {error}
            </motion.p>
          )}
        </form>

        <div className="space-y-2">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                Your list is empty. Start adding items!
              </motion.div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="group"
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-1 flex items-center gap-3">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={() => deleteItem(item.id)}
                      />
                      <div className="flex-1 flex justify-between items-center">
                        <label
                          htmlFor={`item-${item.id}`}
                          className={cn(
                            "cursor-pointer flex-1",
                            item.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {item.name}
                        </label>
                        <div className="flex items-center mr-4">
                          <span className="text-xs text-muted-foreground">
                            {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                          </span>
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {}}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground justify-center py-4 bg-secondary/20">
        Check items or click the trash icon to remove them
      </CardFooter>
    </Card>
  );
}
