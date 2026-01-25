// components/students/GuardianMappingModal.tsx
import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "../ui/input";
import {
  GUARDIANS_RELATIONS,
  guardianService,
} from "@/services/guardianService";

export function GuardianMappingModal({ student, open, onOpenChange }: any) {
  const [existingData, setExistingData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGuardian, setSelectedGuardian] = useState("");
  const [relation, setRelation] = useState("");

  const handleSearch = async () => {
    const res = await userService.search({
      type: "USER",
      searchQuery,
      role: "GUARDIAN",
    });
    setSearchResults(res || []);
    setSelectedGuardian("");
  };

  const onMap = async () => {
    if (!selectedGuardian || !relation)
      return toast.error("Select guardian and relation");

    // Frontend Check for Duplicates
    const isDuplicate = existingData?.guardian?.some(
      (g: any) => g.guardian.userId === selectedGuardian,
    );
    if (isDuplicate)
      return toast.error("This guardian is already linked to this student");

    try {
      const payload = {
        childUserId: student.studentId,
        guardians: [{ guardianUserId: selectedGuardian, relation }],
      };
      console.log("payload", student);
      await guardianService.mapGuardian(payload);
      toast.success("Guardian mapped successfully");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Mapping failed");
    }
  };

  useEffect(() => {
    if (open && student) {
      guardianService
        .getGuardianChildren(student.studentId)
        .then((res) => setExistingData(res));
      handleSearch();
    }
  }, [open, student]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Guardians for {student?.firstName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Guardians</label>
            <div className="text-xs space-y-1">
              {existingData?.guardian?.map((g: any) => (
                <div
                  key={g.guardian.id}
                  className="p-2 border rounded bg-muted/50 flex justify-between"
                >
                  <span>
                    {g.guardian.firstName} ({g.relation})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <hr />

          <div className="space-y-3">
            <label className="text-sm font-medium">Add New Guardian</label>
            <div className="flex gap-2">
              <Input
                placeholder="Search by email/phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="sm" onClick={handleSearch}>
                Search
              </Button>
            </div>

            <div className="flex items-center">
              <Select
                value={selectedGuardian || "-1"}
                onValueChange={setSelectedGuardian}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Guardian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1" disabled>
                    {searchResults?.length
                      ? `${searchResults.length} results`
                      : "No results"}
                  </SelectItem>
                  {searchResults.map((r: any) => (
                    <SelectItem key={r.userId} value={r.userId}>
                      <p className="flex flex-col">
                        <span>
                          {r.firstName} {r.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {r.email}
                        </span>
                      </p>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={setRelation}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select Relation" />
                </SelectTrigger>
                <SelectContent>
                  {GUARDIANS_RELATIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={onMap}>
              Link Guardian
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
