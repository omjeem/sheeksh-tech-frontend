"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2, ShieldCheck, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { guardianService } from "@/services/guardianService";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/common/page-header";
import EmptyState from "@/components/common/empty-state";
import InitialsAvatar from "@/components/common/initials-avatar";
import { Skeleton } from "@/components/ui/skeleton";

type Guardian = {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
};

export default function GuardiansPage() {
  const [search, setSearch] = useState("");
  const [guardians, setGuardians] = useState<Guardian[]>([]);
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
      setGuardians((res as Guardian[]) || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchGuardians, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onCreateGuardian = async (data: any) => {
    try {
      setIsSubmitting(true);
      const payload = [
        {
          ...data,
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
    <>
      <PageHeader
        title="Guardians"
        subtitle="Parent and guardian directory mapped to students."
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Guardians" },
        ]}
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Send size={14} /> Bulk message
            </Button>
            <Dialog
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={14} /> Add guardian
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create new guardian</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(onCreateGuardian)}
                  className="p-5 max-h-[70vh] overflow-y-auto"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>First name</Label>
                      <Input
                        {...register("firstName", { required: true })}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label>Last name</Label>
                      <Input
                        {...register("lastName", { required: true })}
                        placeholder="Doe"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Email</Label>
                      <Input
                        {...register("email", { required: true })}
                        type="email"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        {...register("phone", { required: true })}
                        placeholder="9999999999"
                      />
                    </div>
                    <div>
                      <Label>Date of birth</Label>
                      <Input
                        {...register("dateOfBirth", { required: true })}
                        type="date"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Password</Label>
                      <PasswordInput
                        {...register("password", { required: true })}
                      />
                    </div>
                  </div>
                </form>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit(onCreateGuardian)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    Create guardian
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <div className="relative w-full sm:w-[360px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
          />
          <Input
            placeholder="Search by name, email, or phone"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4 ml-auto text-[13px] text-ink-3">
          <span>
            Total{" "}
            <span className="tnum font-semibold text-ink">
              {guardians.length}
            </span>
          </span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : guardians.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No guardians found"
            description="Add guardians manually or wait for them to be linked to students."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guardian</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guardians.map((g) => {
                const fullName =
                  `${g.firstName} ${g.lastName ?? ""}`.trim();
                return (
                  <TableRow key={g.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={fullName} size="md" />
                        <div>
                          <div className="font-medium text-ink flex items-center gap-1.5">
                            {fullName}
                            <ShieldCheck
                              size={14}
                              className="text-success"
                            />
                          </div>
                          <div className="text-[12px] text-ink-3">
                            Verified
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px]">{g.phone ?? "—"}</div>
                      <div className="text-[12px] text-ink-3">
                        {g.email ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" dot>
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap w-[1%]">
                      <Button variant="ghost" size="sm">
                        View children
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
