"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Loader2 } from "lucide-react";
import { debounce } from "lodash";
import { userService } from "@/services/userService";

interface UserSearchListProps {
  type: string; // "STUDENT" | "TEACHER" | "ADMIN" etc
  classId?: string;
  sectionId?: string;
  selectedValues: string[]; // These should be userIds
  isIncludeMode: boolean;
  onToggle: (userId: string) => void;
}

export function UserSearchList({
  type,
  classId,
  sectionId,
  selectedValues,
  isIncludeMode,
  onToggle,
}: UserSearchListProps) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const getId = (user: any) => {
    let userId = "";
    switch (type) {
      case "TEACHER":
        userId = user.teacherId;
        break;
      case "STUDENT":
        userId = user.studentId;
        break;
      default:
        userId = user.userId;
    }
    console.log("gg", userId);
    return userId;
  };

  const handleToggle = (user: any) => {
    onToggle(getId(user) ?? user?.userId);
  };

  const fetchUsers = useCallback(
    debounce(async (searchQuery: string) => {
      setLoading(true);
      try {
        const response = await userService.search({
          type: type === "GUARDIAN" ? "USER" : type,
          searchQuery,
          classId,
          sectionId,
          role: type === "GUARDIAN" ? "GUARDIAN" : undefined,
        });

        if (Array.isArray(response)) {
          setResults(response);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400),
    [type, classId, sectionId],
  );

  useEffect(() => {
    fetchUsers(query);
  }, [query, fetchUsers]);

  return (
    <div className="space-y-3 mt-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder={`Filter ${type.toLowerCase()}s by name or email...`}
          className="pl-8 h-9 text-xs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto border rounded-lg divide-y bg-muted/5 shadow-inner">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase font-medium">
              Fetching Records...
            </span>
          </div>
        ) : results.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-xs text-muted-foreground">
              No {type.toLowerCase()}s found matching your criteria.
            </p>
          </div>
        ) : (
          results.map((user) => {
            const isSelected = selectedValues.includes(
              getId(user) ?? user?.userId,
            );
            return (
              <div
                key={user.userId}
                className="flex items-center justify-between p-3 hover:bg-accent/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`user-${user.userId}`}
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(user)}
                    className={
                      !isIncludeMode
                        ? "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                        : "data-[state=checked]:bg-primary"
                    }
                  />
                  <div className="space-y-0.5">
                    <label
                      htmlFor={`user-${user.userId}`}
                      className="text-xs font-bold leading-none cursor-pointer group-hover:text-primary transition-colors"
                    >
                      {user.firstName} {user.lastName}
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-muted-foreground tabular-nums">
                        {user.email}
                      </p>
                      {type == "USER" && user?.role && (
                        <span className="text-[10px] py-0 px-1.5 rounded bg-muted font-mono text-muted-foreground">
                          {user?.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
