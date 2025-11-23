"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, FileText, Trash2 } from "lucide-react";
import { useSWR } from "@/hooks/useSWR";
import { sessionService } from "@/services/sessionService";
import { SessionItem } from "@/types/session";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "../ui/password-input";

export type ParsedStudent = {
  firstName: string;
  lastName?: string;
  email?: string;
  password?: string;
  dateOfBirth?: string; // DD-MM-YYYY
};

type UploadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (students: ParsedStudent[], sessionId: string) => Promise<void>;
  selectedSection: string | null;
  selectedClass: string | null;
};

const formatDate = (value: unknown): string | undefined => {
  if (!value) return undefined;
  let dateStr = value.toString().trim();
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) dateStr = `${date.d}/${date.m}/${date.y}`;
  }
  const match = dateStr.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (match) {
    const [_, d, m, y] = match;
    return `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
  }
  return undefined;
};

type ParsedRow = Record<string, unknown>;

const mapToStudentFormat = (rows: ParsedRow[]): ParsedStudent[] => {
  return rows.map((row: ParsedRow) => ({
    firstName: String(
      row["firstName"] || row["First Name"] || row["firstname"] || "",
    ).trim(),
    lastName:
      String(
        row["lastName"] || row["Last Name"] || row["lastname"] || "",
      ).trim() || undefined,
    email: String(row["email"] || row["Email"] || "").trim() || undefined,
    password:
      String(row["password"] || row["Password"] || "").trim() || undefined,
    dateOfBirth: formatDate(
      row["dateOfBirth"] || row["DOB"] || row["dob"] || "",
    ),
  }));
  // .filter((s): s is ParsedStudent => Boolean(s.firstName));
};

export default function StudentUploadModal({
  open,
  onOpenChange,
  onConfirm,
  selectedSection,
  selectedClass,
}: UploadModalProps) {
  const { data: sessionsResp } = useSWR("session", sessionService.list);
  const sessions: SessionItem[] = sessionsResp || [];
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedStudent[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setFile(file);
    setParsedData([]);
    parseFile(file);
  };

  const parseFile = (file: File) => {
    setIsParsing(true);
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const students = mapToStudentFormat(result.data as ParsedRow[]);
          setParsedData(students);
          setIsParsing(false);
        },
        error: () => {
          toast.error("Failed to parse CSV");
          setIsParsing(false);
        },
      });
    } else if (["xlsx", "xls"].includes(extension!)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet) as ParsedRow[];
        const students = mapToStudentFormat(rows);
        setParsedData(students);
        setIsParsing(false);
      };
      reader.readAsBinaryString(file);
    } else {
      toast.error("Only CSV and Excel files are supported");
      setIsParsing(false);
    }
  };

  const updateRow = (
    index: number,
    field: keyof ParsedStudent,
    value: string,
  ) => {
    setParsedData((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value || undefined } : row,
      ),
    );
  };

  const removeRow = (index: number) => {
    setParsedData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (!selectedSection || !selectedClass)
      return toast.error("Select class & section first");
    if (parsedData.length === 0) return toast.error("No data to import");
    if (!selectedSession) return toast.error("Please select a session");
    setIsImporting(true);
    try {
      await onConfirm(parsedData, selectedSession);
      toast.success(`Imported ${parsedData.length} students!`);
      onOpenChange(false);
      resetForm();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Import failed";
      toast.error(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setParsedData([]);
    setSelectedSession("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl sm:max-w-5xl w-4xl max-h-[80vh] mx-4 p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            Bulk Upload Students
          </DialogTitle>
        </DialogHeader>
        {/* Upload Screen */}
        {!file ? (
          <div className="py-12 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Upload CSV or Excel File
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Columns: firstName, lastName, email, password, dateOfBirth
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFileChange(e.target.files[0])
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="w-full h-32 border-2 border-dashed rounded-xl"
              onClick={() => fileInputRef.current?.click()}
              disabled={isParsing}
            >
              <Upload className="w-8 h-8 mb-3" />
              <div>{isParsing ? "Parsing..." : "Click to upload file"}</div>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {parsedData.length} students
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:flex-initial">
                  <Label>Session *</Label>
                  <Select
                    value={selectedSession}
                    onValueChange={setSelectedSession}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            {/* Responsive: Cards on <lg, Table on >=lg */}
            {isParsing ? (
              <p className="text-center py-12">Parsing file...</p>
            ) : parsedData.length === 0 ? (
              <p className="text-center text-destructive py-12">
                No valid data found. Check column names.
              </p>
            ) : (
              <>
                {/* Desktop Table (>= lg) */}
                <div className="hidden lg:block rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                            First Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                            Last Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                            Password
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                            DOB
                          </th>
                          <th className="px-4 py-3 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {parsedData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-muted/50">
                            <td className="px-4 py-3">
                              <Input
                                value={row.firstName}
                                onChange={(e) =>
                                  updateRow(idx, "firstName", e.target.value)
                                }
                                className="h-9"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={row.lastName || ""}
                                onChange={(e) =>
                                  updateRow(idx, "lastName", e.target.value)
                                }
                                className="h-9"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={row.email || ""}
                                onChange={(e) =>
                                  updateRow(idx, "email", e.target.value)
                                }
                                className="h-9"
                                type="email"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <PasswordInput
                                value={row.password || ""}
                                onChange={(e) =>
                                  updateRow(idx, "password", e.target.value)
                                }
                                className="h-8"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={row.dateOfBirth || ""}
                                onChange={(e) =>
                                  updateRow(idx, "dateOfBirth", e.target.value)
                                }
                                placeholder="DD-MM-YYYY"
                                className="h-9 w-32"
                              />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeRow(idx)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Mobile Cards (< lg) */}
                <div className="lg:hidden space-y-4">
                  {parsedData.map((row, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-4 bg-card shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">
                          {row.firstName} {row.lastName}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(idx)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div>
                          <Label className="text-xs">First Name</Label>
                          <Input
                            value={row.firstName}
                            onChange={(e) =>
                              updateRow(idx, "firstName", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Last Name</Label>
                          <Input
                            value={row.lastName || ""}
                            onChange={(e) =>
                              updateRow(idx, "lastName", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Email</Label>
                          <Input
                            value={row.email || ""}
                            onChange={(e) =>
                              updateRow(idx, "email", e.target.value)
                            }
                            type="email"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Password</Label>
                          <PasswordInput
                            value={row.password || ""}
                            onChange={(e) =>
                              updateRow(idx, "password", e.target.value)
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Date of Birth</Label>
                          <Input
                            value={row.dateOfBirth || ""}
                            onChange={(e) =>
                              updateRow(idx, "dateOfBirth", e.target.value)
                            }
                            placeholder="DD-MM-YYYY"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={
                  isImporting || parsedData.length === 0 || !selectedSession
                }
              >
                {isImporting
                  ? "Importing..."
                  : `Import ${parsedData.length} Students`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
