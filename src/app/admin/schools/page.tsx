"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Building2,
  Mail,
  MapPin,
  RefreshCw,
  School,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { PurchasePlanModal } from "@/components/admin/plans/PurchasePlanModal";
import PageHeader from "@/components/common/page-header";
import EmptyState from "@/components/common/empty-state";
import InitialsAvatar from "@/components/common/initials-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Tile from "@/components/common/tile";

interface SchoolUser {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

interface SchoolData {
  id: string;
  name: string;
  email: string;
  url: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  isApproved: boolean;
  isSuspended: boolean;
  createdAt: string;
  users: SchoolUser[];
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSchool, setSelectedSchool] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const fetchSchools = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getSchools();
      const list = response || [];
      setSchools(list);
    } catch {
      toast.error("Failed to fetch school records");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const filteredSchools = schools.filter(
    (school) =>
      school.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.city?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Institutions"
        subtitle="Manage registered schools and their administrative contacts."
        breadcrumb={[
          { label: "System", href: "/admin/schools" },
          { label: "Institutions" },
        ]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchSchools}
            disabled={isLoading}
          >
            <RefreshCw
              size={14}
              className={isLoading ? "animate-spin" : ""}
            />{" "}
            Refresh
          </Button>
        }
      />

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full sm:w-[320px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
          />
          <Input
            placeholder="Search name or city"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filteredSchools.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No institutions yet"
            description="Schools that sign up will appear here for review and management."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Primary admin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.map((school) => {
                const superAdmin = school.users?.[0];
                return (
                  <TableRow key={school.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Tile tone="brand" icon={School} size={36} />
                        <div>
                          <div className="font-semibold text-ink">
                            {school.name}
                          </div>
                          <div className="text-[11px] text-ink-3 mono">
                            {school.id?.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {superAdmin ? (
                        <div className="flex items-center gap-3">
                          <InitialsAvatar
                            name={`${superAdmin.firstName} ${superAdmin.lastName}`}
                            size="sm"
                          />
                          <div>
                            <div className="text-[13px] font-medium">
                              {superAdmin.firstName} {superAdmin.lastName}
                            </div>
                            <div className="text-[12px] text-ink-3 flex items-center gap-1">
                              <Mail size={11} /> {superAdmin.email}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[12px] text-ink-3 italic">
                          No admin assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5 flex-wrap">
                        {school.isApproved ? (
                          <Badge variant="success" dot>
                            <ShieldCheck size={11} /> Approved
                          </Badge>
                        ) : (
                          <Badge variant="warning" dot>
                            Pending
                          </Badge>
                        )}
                        {school.isSuspended && (
                          <Badge variant="danger" dot>
                            <AlertTriangle size={11} /> Suspended
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] text-ink-2 flex items-center gap-1.5">
                        <MapPin size={12} className="text-ink-3" />
                        {school.city}
                      </div>
                      <div className="text-[11px] text-ink-3 ml-[18px]">
                        {school.state}
                      </div>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap w-[1%]">
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => {
                          setSelectedSchool({
                            id: school.id,
                            name: school.name,
                          });
                          setIsPurchaseModalOpen(true);
                        }}
                      >
                        <Zap size={13} /> Assign plan
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <PurchasePlanModal
        school={selectedSchool}
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setSelectedSchool(null);
        }}
      />
    </>
  );
}
