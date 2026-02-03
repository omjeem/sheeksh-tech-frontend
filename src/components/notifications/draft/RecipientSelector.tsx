"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, School, BookOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LogicController } from "./LogicController";
import { UserSearchList } from "./UserSearchList";
import { classService } from "@/services/classService";
import { sectionService } from "@/services/sectionService";

interface Props {
  value: any;
  onChange: (val: any) => void;
}

export default function RecipientSelector({ value, onChange }: Props) {
  const [classes, setClasses] = useState<any[]>([]);
  const [sectionsMap, setSectionsMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    classService.list().then(setClasses);
  }, []);

  const updateFilter = (type: string, updates: any) => {
    const fresh = { ...value };
    if (type === "users") {
      fresh.guardians = undefined;
      fresh.teachers = undefined;
      fresh.students = undefined;
      fresh.sections = undefined;
      fresh.users = {
        ...(fresh.users || { sentAll: false, isInclude: true, values: [] }),
        ...updates,
      };
    } else {
      fresh.users = undefined;
      fresh[type] = {
        ...(fresh[type] || { sentAll: false, isInclude: true, values: [] }),
        ...updates,
      };
    }
    onChange(fresh);
  };

  const toggleIdInCategory = (category: string, id: string) => {
    const current = value[category]?.values || [];
    const values = current.includes(id)
      ? current.filter((i: string) => i !== id)
      : [...current, id];
    updateFilter(category, { values });
  };

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    let sections = [...(value.sections || [])];
    if (checked) {
      sections.push({
        id: sectionId,
        sentAll: true,
        isInclude: true,
        values: [],
      });
    } else {
      sections = sections.filter((s) => s.id !== sectionId);
    }
    onChange({ ...value, users: undefined, sections });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="groups" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" /> Specific Users
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2">
            <School className="h-4 w-4" /> Academic Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <LogicController
            label="Individual Recipients"
            state={
              value.users || { sentAll: false, isInclude: true, values: [] }
            }
            onUpdate={(u) => updateFilter("users", u)}
          />
          {value.users && !value.users.sentAll && (
            <UserSearchList
              type="USER"
              selectedValues={value.users.values}
              isIncludeMode={value.users.isInclude}
              onToggle={(id) => toggleIdInCategory("users", id)}
            />
          )}
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <LogicController
                icon={<BookOpen className="h-4 w-4" />}
                label="Guardians"
                state={
                  value.guardians || {
                    sentAll: false,
                    isInclude: true,
                    values: [],
                  }
                }
                onUpdate={(u) => updateFilter("guardians", u)}
              />
              {value.guardians && !value.guardians.sentAll && (
                <UserSearchList
                  type="GUARDIAN"
                  selectedValues={value.guardians.values}
                  isIncludeMode={value.guardians.isInclude}
                  onToggle={(id) => toggleIdInCategory("guardians", id)}
                />
              )}
            </div>
            <div className="space-y-2">
              <LogicController
                icon={<BookOpen className="h-4 w-4" />}
                label="Teachers"
                state={
                  value.teachers || {
                    sentAll: false,
                    isInclude: true,
                    values: [],
                  }
                }
                onUpdate={(u) => updateFilter("teachers", u)}
              />
              {value.teachers && !value.teachers.sentAll && (
                <UserSearchList
                  type="TEACHER"
                  selectedValues={value.teachers.values}
                  isIncludeMode={value.teachers.isInclude}
                  onToggle={(id) => toggleIdInCategory("teachers", id)}
                />
              )}
            </div>
            <div className="space-y-2">
              <LogicController
                icon={<GraduationCap className="h-4 w-4" />}
                label="Students"
                state={
                  value.students || {
                    sentAll: false,
                    isInclude: true,
                    values: [],
                  }
                }
                onUpdate={(u) => updateFilter("students", u)}
              />
              {value.students && !value.students.sentAll && (
                <UserSearchList
                  type="STUDENT"
                  selectedValues={value.students.values}
                  isIncludeMode={value.students.isInclude}
                  onToggle={(id) => toggleIdInCategory("students", id)}
                />
              )}
            </div>
          </div>

          <Separator />
          <h3 className="text-xs font-bold uppercase text-muted-foreground px-1">
            Class / Section Targeting
          </h3>

          <Accordion
            type="single"
            collapsible
            className="space-y-3 max-h-[50vh] overflow-auto"
          >
            {classes.map((cls) => (
              <AccordionItem
                key={cls.id}
                value={cls.id}
                className="border rounded-lg bg-card overflow-hidden"
              >
                <AccordionTrigger
                  className="px-4"
                  onClick={() =>
                    !sectionsMap[cls.id] &&
                    sectionService
                      .list(cls.id)
                      .then((data) =>
                        setSectionsMap((prev) => ({ ...prev, [cls.id]: data })),
                      )
                  }
                >
                  Class {cls.name}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4 border-t pt-4">
                  {sectionsMap[cls.id]?.map((sec) => {
                    const secConfig = value.sections?.find(
                      (s: any) => s.id === sec.id,
                    );
                    return (
                      <div key={sec.id} className="pl-3 border-l-2 space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={sec.id}
                            checked={!!secConfig}
                            onCheckedChange={(c) =>
                              handleSectionToggle(sec.id, !!c)
                            }
                          />
                          <Label htmlFor={sec.id} className="text-sm font-bold">
                            Section {sec.name}
                          </Label>
                        </div>
                        {secConfig && (
                          <div className="space-y-4">
                            <LogicController
                              label={`Section ${sec.name} Filter`}
                              state={secConfig}
                              onUpdate={(u) => {
                                const updated = value.sections.map((s: any) =>
                                  s.id === sec.id ? { ...s, ...u } : s,
                                );
                                onChange({ ...value, sections: updated });
                              }}
                            />
                            {!secConfig.sentAll && (
                              <UserSearchList
                                type="STUDENT"
                                classId={cls.id}
                                sectionId={sec.id}
                                selectedValues={secConfig.values}
                                isIncludeMode={secConfig.isInclude}
                                onToggle={(uid) => {
                                  const updated = value.sections.map(
                                    (s: any) => {
                                      if (s.id !== sec.id) return s;
                                      const vals = s.values.includes(uid)
                                        ? s.values.filter(
                                            (v: string) => v !== uid,
                                          )
                                        : [...s.values, uid];
                                      return { ...s, values: vals };
                                    },
                                  );
                                  onChange({ ...value, sections: updated });
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
