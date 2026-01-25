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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  School,
  Search,
  MapPin,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Zap,
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { PurchasePlanModal } from "@/components/admin/plans/PurchasePlanModal";

// Define the interface based on your provided JSON
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
      // Accessing response.data.data based on your JSON example
      const list = response || [];
      setSchools(list);
    } catch (error) {
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
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institutions</h1>
          <p className="text-muted-foreground text-sm">
            Manage registered schools and their administrative contacts.
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={fetchSchools}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name or city..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[300px]">School Details</TableHead>
                <TableHead>Primary Admin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                {/*<TableHead className="text-right">Actions</TableHead>*/}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading institutional data...
                    </p>
                  </TableCell>
                </TableRow>
              ) : filteredSchools.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No schools found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSchools.map((school) => {
                  const superAdmin = school.users?.[0]; // Get the first user from the array

                  return (
                    <TableRow
                      key={school.id}
                      className="group transition-colors hover:bg-muted/10"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <School className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                              {school.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {school.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {superAdmin ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {superAdmin.firstName} {superAdmin.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {superAdmin.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            No admin assigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5 flex-wrap">
                          {school.isApproved ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20 gap-1"
                            >
                              <ShieldCheck className="h-3 w-3" /> Approved
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                            >
                              Pending
                            </Badge>
                          )}
                          {school.isSuspended && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] gap-1"
                            >
                              <AlertTriangle className="h-3 w-3" /> Suspended
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {school.city}
                          </span>
                          <span className="text-[11px] opacity-70">
                            {school.state}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                          onClick={() => {
                            setSelectedSchool({
                              id: school.id,
                              name: school.name,
                            });
                            setIsPurchaseModalOpen(true);
                          }}
                        >
                          <Zap className="h-3 w-3" /> Assign Plan
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PurchasePlanModal
        school={selectedSchool}
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setSelectedSchool(null);
        }}
      />
    </div>
  );
}
