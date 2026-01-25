"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { guardianService } from "@/services/guardianService";
import { PasswordInput } from "@/components/ui/password-input";

export default function GuardiansPage() {
  const [search, setSearch] = useState("");
  const [guardians, setGuardians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchGuardians = async () => {
    try {
      setLoading(true);
      const res = await userService.search({
        type: "USER",
        searchQuery: search,
        role: "GUARDIAN",
      });
      setGuardians(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchGuardians, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const onCreateGuardian = async (data: any) => {
    try {
      setIsSubmitting(true);
      // Payload must be an array based on Step 4 requirements
      const payload = [
        {
          ...data,
          // Format date if necessary, ensuring it matches "DD-MM-YYYY"
          dateOfBirth: data.dateOfBirth.split("-").reverse().join("-"),
        },
      ];

      await guardianService.createGuardian(payload);
      toast.success("Guardian created successfully");
      setCreateDialogOpen(false);
      reset();
      fetchGuardians();
    } catch (error: any) {
      toast.error(error.message || "Failed to create guardian");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Guardian Directory
          </h1>
          <p className="text-muted-foreground">
            Manage guardians and their student mappings.
          </p>
        </div>

        {/* CREATE GUARDIAN DIALOG */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-chart-1 to-chart-2">
              <Plus className="w-4 h-4 mr-2" /> Add Guardian
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Guardian</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onCreateGuardian)}
              className="space-y-4 pt-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    {...register("firstName", { required: true })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    {...register("lastName", { required: true })}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    {...register("phone", { required: true })}
                    placeholder="9999999999"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input
                    {...register("dateOfBirth", { required: true })}
                    type="date"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <PasswordInput
                  {...register("password", { required: true })}
                  type="password"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Guardian
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or phone..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Info</TableHead>
              {/*<TableHead>User Role</TableHead>*/}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : guardians.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  No guardians found.
                </TableCell>
              </TableRow>
            ) : (
              guardians.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">
                    {g.firstName} {g.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{g.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {g.phone}
                    </div>
                  </TableCell>
                  {/*<TableCell>
                    <Badge variant="secondary" className="font-semibold">
                      {g.role}
                    </Badge>
                  </TableCell>*/}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Children
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
