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
  dateOfBirth?: string; // DD-MM-YYYY
  startDate?: string; // DD-MM-YYYY
  endDate?: string; // DD-MM-YYYY (optional)
};

type UploadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (teachers: ParsedTeacher[]) => Promise<void>;
};

const formatDate = (value: unknown): string | undefined => {
  if (!value) return undefined;
  let str = value.toString().trim();
  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    if (d) str = `${d.d}/${d.m}/${d.y}`;
  }
  const match = str.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (match) {
    const [_, d, m, y] = match;
    return `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
  }
  return undefined;
};

export default function TeacherUploadModal({
  open,
  onOpenChange,
  onConfirm,
}: UploadModalProps) {
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
          const rows = res.data as Record<string, unknown>[];
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
        const data = e.target?.result as string;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet) as Record<
          string,
          unknown
        >[];
        setParsedData(mapRows(rows));
        setIsParsing(false);
      };
      reader.readAsBinaryString(f);
    } else {
      toast.error("Only CSV and Excel files supported");
      setIsParsing(false);
    }
  };

  const mapRows = (rows: Record<string, unknown>[]): ParsedTeacher[] => {
    return rows
      .map((row) => ({
        firstName: String(row.firstName || row["First Name"] || "").trim(),
        lastName:
          String(row.lastName || row["Last Name"] || "").trim() || undefined,
        email: String(row.email || row.Email || "").trim() || undefined,
        password:
          String(row.password || row.Password || "").trim() || undefined,
        designation:
          (String(row.designation || row.Designation || "").toUpperCase() as
            | "TGT"
            | "PGT") || "TGT",
        dateOfBirth: formatDate(row.dateOfBirth || row.DOB || row.dob),
        startDate: formatDate(row.startDate || row["Start Date"]),
        endDate: formatDate(row.endDate || row["End Date"]),
      }))
      .filter((t): t is ParsedTeacher =>
        Boolean(t.firstName && t.email && t.dateOfBirth && t.startDate),
      );
  };

  const updateRow = (i: number, field: keyof ParsedTeacher, value: string) => {
    setParsedData((prev) =>
      prev.map((row, idx) =>
        idx === i ? { ...row, [field]: value || undefined } : row,
      ),
    );
  };

  const removeRow = (i: number) => {
    setParsedData((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return toast.error("No valid data to import");
    setIsImporting(true);
    try {
      await onConfirm(parsedData);
      onOpenChange(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Import failed";
      toast.error(message);
    } finally {
      setIsImporting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setParsedData([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl sm:max-w-5xl w-4xl max-h-[80vh] mx-4 p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Teachers</DialogTitle>
        </DialogHeader>
        {!file ? (
          <div className="py-12 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Upload CSV or Excel</h3>
            <p className="text-sm text-muted-foreground">
              Required: firstName, email, designation, dateOfBirth, startDate
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFileChange(e.target.files[0]!)
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
              {isParsing ? "Parsing..." : "Click to upload"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
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
              <Button variant="ghost" size="icon" onClick={reset}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {isParsing ? (
              <p className="text-center py-12">Parsing file...</p>
            ) : parsedData.length === 0 ? (
              <p className="text-center text-destructive py-12">
                No valid data found
              </p>
            ) : (
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto rounded-lg border">
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
                              className="h-9 max-w-fit w-[20ch]"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={t.lastName || ""}
                              onChange={(e) =>
                                updateRow(i, "lastName", e.target.value)
                              }
                              className="h-9 max-w-fit w-[20ch]"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={t.email || ""}
                              onChange={(e) =>
                                updateRow(i, "email", e.target.value)
                              }
                              type="email"
                              className="h-9 max-w-fit w-[20ch]"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Select
                              value={t.designation}
                              onValueChange={(v) =>
                                updateRow(i, "designation", v)
                              }
                            >
                              <SelectTrigger className="h-9 w-24">
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
                              placeholder="DD-MM-YYYY"
                              className="h-9 w-32"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={t.startDate || ""}
                              onChange={(e) =>
                                updateRow(i, "startDate", e.target.value)
                              }
                              placeholder="DD-MM-YYYY"
                              className="h-9 w-32"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={t.endDate || ""}
                              onChange={(e) =>
                                updateRow(i, "endDate", e.target.value)
                              }
                              placeholder="DD-MM-YYYY"
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

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {parsedData.map((t, i) => (
                    <div key={i} className="border rounded-lg p-4 bg-card">
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
                          <Label className="text-xs">Designation</Label>
                          <Select
                            value={t.designation}
                            onValueChange={(v) =>
                              updateRow(i, "designation", v)
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
                            placeholder="DD-MM-YYYY"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Start Date</Label>
                          <Input
                            value={t.startDate || ""}
                            onChange={(e) =>
                              updateRow(i, "startDate", e.target.value)
                            }
                            placeholder="DD-MM-YYYY"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">End Date</Label>
                          <Input
                            value={t.endDate || ""}
                            onChange={(e) =>
                              updateRow(i, "endDate", e.target.value)
                            }
                            placeholder="DD-MM-YYYY"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
