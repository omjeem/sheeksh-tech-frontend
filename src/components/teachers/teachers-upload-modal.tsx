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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ParsedTeacher = {
  firstName: string;
  lastName?: string;
  email?: string;
  password?: string;
  designation: "TGT" | "PGT";
  dateOfBirth?: string; // DD/MM/YYYY
  startDate?: string; // DD/MM/YYYY
  endDate?: string; // DD/MM/YYYY (optional)
};

type TeacherUploadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (teachers: ParsedTeacher[]) => Promise<void>;
};

const formatDate = (value: any): string | undefined => {
  if (!value) return undefined;
  let str = value.toString().trim();
  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    if (d) str = `${d.d}/${d.m}/${d.y}`;
  }
  const match = str.match(/(\d{1,2})[\/\-\.](\n{1,2})[\/\-\.](\d{4})/);
  if (match) {
    const [_, d, m, y] = match;
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  }
  return undefined;
};

export default function TeacherUploadModal({
  open,
  onOpenChange,
  onConfirm,
}: TeacherUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTeacher[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (f: File) => {
    setFile(f);
    setParsedData([]);
    parseFile(f);
  };

  const parseFile = (f: File) => {
    setIsParsing(true);
    const ext = f.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(f, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const rows = res.data as any[];
          setParsedData(mapRows(rows));
          setIsParsing(false);
        },
        error: () => {
          toast.error("Failed to parse CSV");
          setIsParsing(false);
        },
      });
    } else if (["xlsx", "xls"].includes(ext!)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        setParsedData(mapRows(rows));
        setIsParsing(false);
      };
      reader.readAsBinaryString(f);
    } else {
      toast.error("Only CSV & Excel supported");
      setIsParsing(false);
    }
  };

  const mapRows = (rows: any[]): ParsedTeacher[] => {
    return rows
      .map((r: any) => ({
        firstName: (r.firstName || r["First Name"] || r.firstname || "").trim(),
        lastName:
          (r.lastName || r["Last Name"] || r.lastname || "").trim() ||
          undefined,
        email: (r.email || r.Email || "").trim() || undefined,
        password: (r.password || r.Password || "").trim() || undefined,
        designation:
          (r.designation || r.Designation || "TGT").toUpperCase() === "PGT"
            ? "PGT"
            : "TGT",
        dateOfBirth: formatDate(r.dateOfBirth || r.dob || r["Date of Birth"]),
        startDate: formatDate(r.startDate || r["Start Date"]),
        endDate: formatDate(r.endDate || r["End Date"]) || undefined,
      }))
      .filter((t) => t.firstName && t.startDate);
  };

  const updateRow = (
    idx: number,
    field: keyof ParsedTeacher,
    value: string,
  ) => {
    setParsedData((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, [field]: value || undefined } : r,
      ),
    );
  };

  const removeRow = (idx: number) => {
    setParsedData((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return toast.error("No data to import");

    setIsImporting(true);
    try {
      await onConfirm(parsedData);
      toast.success(`Imported ${parsedData.length} teachers successfully`);
      onOpenChange(false);
      setFile(null);
      setParsedData([]);
    } catch (err: any) {
      toast.error(err?.message || "Import failed");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full mx-4 p-4 sm:p-6 max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            Bulk Upload Teachers
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
                Upload Teachers CSV/Excel
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Columns: firstName, lastName, email, password, designation
                (TGT/PGT), dateOfBirth, startDate, endDate
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
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {parsedData.length} teachers
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFile(null);
                  setParsedData([]);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Responsive View */}
            {isParsing ? (
              <p className="text-center py-12">Parsing file...</p>
            ) : parsedData.length === 0 ? (
              <p className="text-center text-destructive py-12">
                No valid data found
              </p>
            ) : (
              <>
                {/* Desktop Table */}
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
                            Designation
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                            DOB
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                            Start Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                            End Date
                          </th>
                          <th className="px-4 py-3 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {parsedData.map((t, i) => (
                          <tr key={i} className="hover:bg-muted/50">
                            <td className="px-4 py-3">
                              <Input
                                value={t.firstName}
                                onChange={(e) =>
                                  updateRow(i, "firstName", e.target.value)
                                }
                                className="h-9"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={t.lastName || ""}
                                onChange={(e) =>
                                  updateRow(i, "lastName", e.target.value)
                                }
                                className="h-9"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={t.email || ""}
                                onChange={(e) =>
                                  updateRow(i, "email", e.target.value)
                                }
                                className="h-9"
                                type="email"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={t.password || ""}
                                onChange={(e) =>
                                  updateRow(i, "password", e.target.value)
                                }
                                className="h-9"
                                type="password"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Select
                                value={t.designation}
                                onValueChange={(v) =>
                                  updateRow(i, "designation", v as any)
                                }
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TGT">TGT</SelectItem>
                                  <SelectItem value="PGT">PGT</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={t.dateOfBirth || ""}
                                onChange={(e) =>
                                  updateRow(i, "dateOfBirth", e.target.value)
                                }
                                placeholder="DD/MM/YYYY"
                                className="h-9 w-32"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={t.startDate || ""}
                                onChange={(e) =>
                                  updateRow(i, "startDate", e.target.value)
                                }
                                placeholder="DD/MM/YYYY"
                                className="h-9 w-32"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={t.endDate || ""}
                                onChange={(e) =>
                                  updateRow(i, "endDate", e.target.value)
                                }
                                placeholder="DD/MM/YYYY"
                                className="h-9 w-32"
                              />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeRow(i)}
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

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {parsedData.map((t, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-4 bg-card shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">
                          {t.firstName} {t.lastName}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(i)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div>
                          <Label className="text-xs">First Name</Label>
                          <Input
                            value={t.firstName}
                            onChange={(e) =>
                              updateRow(i, "firstName", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Last Name</Label>
                          <Input
                            value={t.lastName || ""}
                            onChange={(e) =>
                              updateRow(i, "lastName", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Email</Label>
                          <Input
                            value={t.email || ""}
                            onChange={(e) =>
                              updateRow(i, "email", e.target.value)
                            }
                            type="email"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Password</Label>
                          <Input
                            value={t.password || ""}
                            onChange={(e) =>
                              updateRow(i, "password", e.target.value)
                            }
                            type="password"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Designation</Label>
                          <Select
                            value={t.designation}
                            onValueChange={(v) =>
                              updateRow(i, "designation", v as any)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TGT">TGT</SelectItem>
                              <SelectItem value="PGT">PGT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">DOB</Label>
                          <Input
                            value={t.dateOfBirth || ""}
                            onChange={(e) =>
                              updateRow(i, "dateOfBirth", e.target.value)
                            }
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Start Date</Label>
                          <Input
                            value={t.startDate || ""}
                            onChange={(e) =>
                              updateRow(i, "startDate", e.target.value)
                            }
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">End Date</Label>
                          <Input
                            value={t.endDate || ""}
                            onChange={(e) =>
                              updateRow(i, "endDate", e.target.value)
                            }
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={isImporting || parsedData.length === 0}
              >
                {isImporting
                  ? "Importing..."
                  : `Import ${parsedData.length} Teachers`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
