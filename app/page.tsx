"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Droplets,
  FileText,
  MapPin,
  PawPrint,
  Phone,
  Road,
  Search,
  ShieldCheck,
  Siren,
  Sparkles,
  Trash2,
  TreePine,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ComplaintStatus =
  | "Submitted"
  | "Under review"
  | "Assigned"
  | "In progress"
  | "Resolved";

type Priority = "Normal" | "Urgent" | "Emergency";

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  ward: string;
  address: string;
  landmark: string;
  citizenName: string;
  phone: string;
  email: string;
  priority: Priority;
  status: ComplaintStatus;
  createdAt: string;
  dueDate: string;
  updates: string[];
};

type CategoryOption = {
  value: string;
  label: string;
  department: string;
  slaDays: number;
  description: string;
  Icon: LucideIcon;
};

type FormState = {
  category: string;
  ward: string;
  priority: Priority;
  citizenName: string;
  phone: string;
  email: string;
  address: string;
  landmark: string;
  title: string;
  description: string;
};

const categories: CategoryOption[] = [
  {
    value: "water",
    label: "Water supply",
    department: "Water Works Department",
    slaDays: 2,
    description: "No supply, dirty water, leakage, low pressure",
    Icon: Droplets,
  },
  {
    value: "roads",
    label: "Roads and potholes",
    department: "Roads and Engineering Department",
    slaDays: 5,
    description: "Potholes, broken footpaths, unsafe crossings",
    Icon: Road,
  },
  {
    value: "waste",
    label: "Garbage and sanitation",
    department: "Solid Waste Management",
    slaDays: 2,
    description: "Garbage collection, dumping, street sweeping",
    Icon: Trash2,
  },
  {
    value: "streetlights",
    label: "Street lights",
    department: "Electrical Maintenance",
    slaDays: 3,
    description: "Broken poles, dark lanes, sparking wires",
    Icon: Zap,
  },
  {
    value: "drainage",
    label: "Drainage and sewer",
    department: "Drainage and Sewerage Cell",
    slaDays: 3,
    description: "Blocked drains, sewer overflow, waterlogging",
    Icon: Wrench,
  },
  {
    value: "parks",
    label: "Parks and public spaces",
    department: "Parks and Horticulture",
    slaDays: 7,
    description: "Damaged benches, unsafe parks, tree concerns",
    Icon: TreePine,
  },
  {
    value: "animals",
    label: "Stray animals",
    department: "Animal Welfare Cell",
    slaDays: 4,
    description: "Stray cattle, dog bite risks, injured animals",
    Icon: PawPrint,
  },
  {
    value: "safety",
    label: "Public safety",
    department: "Municipal Safety Desk",
    slaDays: 1,
    description: "Open manholes, unsafe buildings, hazard reports",
    Icon: Siren,
  },
];

const wards = [
  "Ward 1 - City Centre",
  "Ward 2 - Railway Colony",
  "Ward 3 - Civil Lines",
  "Ward 4 - Old Market",
  "Ward 5 - Riverfront",
  "Ward 6 - Industrial Area",
  "Ward 7 - University Road",
  "Ward 8 - Green Park",
];

const statusOrder: ComplaintStatus[] = [
  "Submitted",
  "Under review",
  "Assigned",
  "In progress",
  "Resolved",
];

const statusProgress: Record<ComplaintStatus, number> = {
  Submitted: 12,
  "Under review": 34,
  Assigned: 56,
  "In progress": 78,
  Resolved: 100,
};

const initialForm: FormState = {
  category: "",
  ward: "",
  priority: "Normal",
  citizenName: "",
  phone: "",
  email: "",
  address: "",
  landmark: "",
  title: "",
  description: "",
};

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getCategory(value: string) {
  return categories.find((category) => category.value === value);
}

function buildSampleComplaints(): Complaint[] {
  return [
    {
      id: "MUN-2026-182431",
      title: "Street light not working near school gate",
      description:
        "The lane outside the government school has been dark for four nights and students use it after evening tuition.",
      category: "streetlights",
      department: "Electrical Maintenance",
      ward: "Ward 3 - Civil Lines",
      address: "School Road, near community hall",
      landmark: "Government Inter College",
      citizenName: "Aarav Sharma",
      phone: "9876543210",
      email: "aarav@example.com",
      priority: "Urgent",
      status: "In progress",
      createdAt: daysAgo(3),
      dueDate: daysFromNow(1),
      updates: [
        "Ticket received by ward helpdesk.",
        "Electrical team assigned for evening inspection.",
        "Repair van scheduled with replacement lamp.",
      ],
    },
    {
      id: "MUN-2026-245019",
      title: "Garbage pile outside vegetable market",
      description:
        "Waste has not been lifted for two days and the smell is spreading to nearby shops.",
      category: "waste",
      department: "Solid Waste Management",
      ward: "Ward 4 - Old Market",
      address: "Vegetable Market back lane",
      landmark: "Gate number 2",
      citizenName: "Meera Khan",
      phone: "9123456780",
      email: "meera@example.com",
      priority: "Normal",
      status: "Assigned",
      createdAt: daysAgo(1),
      dueDate: daysFromNow(1),
      updates: [
        "Sanitation supervisor notified.",
        "Collection truck assigned for the morning route.",
      ],
    },
    {
      id: "MUN-2026-620784",
      title: "Open manhole after rain",
      description:
        "A manhole cover is missing on the main road after last night's rain. Vehicles are swerving suddenly.",
      category: "safety",
      department: "Municipal Safety Desk",
      ward: "Ward 5 - Riverfront",
      address: "Riverfront main road",
      landmark: "Near bus stop",
      citizenName: "Dev Patel",
      phone: "9988776655",
      email: "dev@example.com",
      priority: "Emergency",
      status: "Under review",
      createdAt: daysAgo(0),
      dueDate: daysFromNow(1),
      updates: ["Emergency desk alerted. Ward engineer is verifying the site."],
    },
  ];
}

function createTicketId() {
  const randomValues = new Uint32Array(1);
  window.crypto.getRandomValues(randomValues);
  const serial = String(randomValues[0] % 900000).padStart(6, "0");
  return `MUN-${new Date().getFullYear()}-${serial}`;
}

function statusClass(status: ComplaintStatus) {
  switch (status) {
    case "Resolved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "In progress":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "Assigned":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    case "Under review":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function priorityClass(priority: Priority) {
  switch (priority) {
    case "Emergency":
      return "border-red-200 bg-red-50 text-red-700";
    case "Urgent":
      return "border-orange-200 bg-orange-50 text-orange-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [formError, setFormError] = useState("");
  const [highlightTicket, setHighlightTicket] = useState("");
  const [trackQuery, setTrackQuery] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("civicconnect-complaints");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Complaint[];
        setComplaints(parsed);
      } catch {
        setComplaints(buildSampleComplaints());
      }
    } else {
      setComplaints(buildSampleComplaints());
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      window.localStorage.setItem(
        "civicconnect-complaints",
        JSON.stringify(complaints),
      );
    }
  }, [complaints, hasLoaded]);

  const selectedCategory = getCategory(form.category);
  const SelectedIcon = selectedCategory?.Icon ?? Building2;

  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(
      (complaint) => complaint.status === "Resolved",
    ).length;
    const emergencies = complaints.filter(
      (complaint) => complaint.priority === "Emergency",
    ).length;
    const averageProgress = total
      ? Math.round(
          complaints.reduce(
            (sum, complaint) => sum + statusProgress[complaint.status],
            0,
          ) / total,
        )
      : 0;

    return {
      total,
      resolved,
      open: total - resolved,
      emergencies,
      averageProgress,
    };
  }, [complaints]);

  const highlightedComplaint = complaints.find(
    (complaint) => complaint.id === highlightTicket,
  );

  const searchedComplaint = useMemo(() => {
    const query = trackQuery.trim().toUpperCase();
    if (!query) {
      return highlightedComplaint;
    }
    return complaints.find((complaint) =>
      complaint.id.toUpperCase().includes(query),
    );
  }, [complaints, highlightedComplaint, trackQuery]);

  const recentComplaints = useMemo(
    () =>
      [...complaints].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [complaints],
  );

  function updateField<Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submitComplaint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const category = selectedCategory;

    if (
      !category ||
      !form.ward ||
      !form.citizenName ||
      !form.phone ||
      !form.address ||
      !form.title ||
      !form.description
    ) {
      setFormError(
        "Please fill the category, ward, contact, location, title, and issue details.",
      );
      return;
    }

    const ticketId = createTicketId();
    const complaint: Complaint = {
      id: ticketId,
      title: form.title,
      description: form.description,
      category: category.value,
      department: category.department,
      ward: form.ward,
      address: form.address,
      landmark: form.landmark,
      citizenName: form.citizenName,
      phone: form.phone,
      email: form.email,
      priority: form.priority,
      status: "Submitted",
      createdAt: new Date().toISOString(),
      dueDate: daysFromNow(category.slaDays),
      updates: [
        "Complaint submitted successfully.",
        `${category.department} will review the report within ${category.slaDays} day${category.slaDays === 1 ? "" : "s"}.`,
      ],
    };

    setComplaints((current) => [complaint, ...current]);
    setHighlightTicket(ticketId);
    setTrackQuery(ticketId);
    setForm(initialForm);
    setFormError("");
  }

  function moveStatus(ticketId: string) {
    setComplaints((current) =>
      current.map((complaint) => {
        if (complaint.id !== ticketId || complaint.status === "Resolved") {
          return complaint;
        }
        const nextStatus =
          statusOrder[statusOrder.indexOf(complaint.status) + 1] ??
          complaint.status;
        return {
          ...complaint,
          status: nextStatus,
          updates: [
            ...complaint.updates,
            `Status changed to ${nextStatus} by the municipal desk.`,
          ],
        };
      }),
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#e9f4f4_52%,_#eef6ff_100%)] text-slate-950">
      <div className="civic-grid pointer-events-none fixed inset-0 opacity-70" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/90 px-5 py-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-900/20">
              <Building2 className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
                CivicConnect
              </p>
              <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Municipality Complaint Portal
              </h1>
            </div>
          </div>
          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3 md:text-right">
            <span className="rounded-full bg-teal-50 px-3 py-2 font-medium text-teal-800">
              24×7 intake
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-2 font-medium text-blue-800">
              Ward routing
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-2 font-medium text-amber-800">
              SLA tracking
            </span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/80 bg-white/95 shadow-xl shadow-slate-900/10">
            <CardHeader className="gap-4 border-b border-slate-100">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    File a municipal complaint
                  </CardTitle>
                  <CardDescription className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                    Report problems related to water, roads, sanitation,
                    street lights, drainage, parks, stray animals, or public
                    safety. The portal creates a ticket and routes it to the
                    responsible municipal department.
                  </CardDescription>
                </div>
                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-teal-900">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <SelectedIcon className="size-4" aria-hidden="true" />
                    Routed department
                  </div>
                  <p className="mt-2 text-lg font-bold">
                    {selectedCategory?.department ?? "Select a category"}
                  </p>
                  <p className="mt-1 text-sm text-teal-800">
                    {selectedCategory
                      ? `${selectedCategory.slaDays} day${selectedCategory.slaDays === 1 ? "" : "s"} target response`
                      : "The correct desk appears here."}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="grid gap-5" onSubmit={submitComplaint}>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Problem category
                    <Select
                      value={form.category || undefined}
                      onValueChange={(value) => updateField("category", value)}
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white text-base shadow-none md:text-sm">
                        <SelectValue placeholder="Choose service" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Ward
                    <Select
                      value={form.ward || undefined}
                      onValueChange={(value) => updateField("ward", value)}
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white text-base shadow-none md:text-sm">
                        <SelectValue placeholder="Select ward" />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem key={ward} value={ward}>
                            {ward}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Priority
                    <Select
                      value={form.priority}
                      onValueChange={(value) =>
                        updateField("priority", value as Priority)
                      }
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white text-base shadow-none md:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Your name
                    <Input
                      className="h-11 rounded-xl border-slate-200 bg-white"
                      placeholder="Citizen name"
                      value={form.citizenName}
                      onChange={(event) =>
                        updateField("citizenName", event.target.value)
                      }
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Mobile number
                    <Input
                      className="h-11 rounded-xl border-slate-200 bg-white"
                      inputMode="tel"
                      placeholder="10-digit contact number"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Email for updates
                  <Input
                    className="h-11 rounded-xl border-slate-200 bg-white"
                    type="email"
                    placeholder="optional@example.com"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Location of issue
                    <Input
                      className="h-11 rounded-xl border-slate-200 bg-white"
                      placeholder="Street, area, house number, or public place"
                      value={form.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Nearby landmark
                    <Input
                      className="h-11 rounded-xl border-slate-200 bg-white"
                      placeholder="Temple, school, market"
                      value={form.landmark}
                      onChange={(event) =>
                        updateField("landmark", event.target.value)
                      }
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Complaint title
                  <Input
                    className="h-11 rounded-xl border-slate-200 bg-white"
                    placeholder="Example: Drain blocked near lane 5"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Explain the problem
                  <Textarea
                    className="min-h-32 rounded-xl border-slate-200 bg-white"
                    placeholder="Mention what happened, how long it has been happening, and if anyone is at immediate risk."
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                  />
                </label>

                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <ShieldCheck
                      className="mt-0.5 size-5 text-teal-700"
                      aria-hidden="true"
                    />
                    <p>
                      Emergency reports are highlighted for the municipal desk.
                      For police, fire, or ambulance emergencies, call the local
                      emergency number immediately.
                    </p>
                  </div>
                  <Button className="h-11 rounded-xl bg-teal-700 px-6 text-white hover:bg-teal-800">
                    Submit complaint
                  </Button>
                </div>

                <div aria-live="polite">
                  {formError ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {formError}
                    </p>
                  ) : null}
                  {highlightedComplaint ? (
                    <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                      Ticket {highlightedComplaint.id} has been created and
                      routed to {highlightedComplaint.department}.
                    </p>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <aside className="grid content-start gap-6">
            <Card className="border-white/80 bg-slate-950 text-white shadow-xl shadow-slate-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ClipboardList className="size-6 text-teal-300" />
                  Live municipal desk
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Current intake, open cases, and progress across all municipal
                  service requests in this portal.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-slate-300">Open tickets</p>
                    <p className="mt-2 text-3xl font-bold">{stats.open}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-slate-300">Resolved</p>
                    <p className="mt-2 text-3xl font-bold">{stats.resolved}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-slate-300">Total reports</p>
                    <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-slate-300">Emergency</p>
                    <p className="mt-2 text-3xl font-bold">
                      {stats.emergencies}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Average case progress</span>
                    <span className="font-semibold">{stats.averageProgress}%</span>
                  </div>
                  <Progress
                    className="mt-3 bg-white/15 [&_[data-slot=progress-indicator]]:bg-teal-300"
                    value={stats.averageProgress}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/80 bg-white/95 shadow-xl shadow-slate-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Search className="size-5 text-teal-700" />
                  Track a complaint
                </CardTitle>
                <CardDescription>
                  Enter a ticket number to check the assigned department,
                  progress, and expected response date.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex gap-2">
                  <Input
                    className="h-11 rounded-xl border-slate-200 bg-white"
                    placeholder="MUN-2026-182431"
                    value={trackQuery}
                    onChange={(event) => setTrackQuery(event.target.value)}
                  />
                  <Button
                    type="button"
                    className="h-11 rounded-xl bg-slate-950 px-4 text-white hover:bg-slate-800"
                    onClick={() => setTrackQuery(trackQuery.trim())}
                    aria-label="Search ticket"
                  >
                    <Search className="size-4" />
                  </Button>
                </div>

                {searchedComplaint ? (
                  <TicketCard complaint={searchedComplaint} />
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                    Try one of the sample tickets from the staff queue, or file
                    a new complaint to generate your own ticket number.
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </section>

        <Tabs defaultValue="queue" className="gap-5">
          <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-white/90 p-2 shadow-sm backdrop-blur">
            <TabsTrigger className="rounded-xl py-3 text-sm" value="queue">
              Staff queue
            </TabsTrigger>
            <TabsTrigger className="rounded-xl py-3 text-sm" value="services">
              Services
            </TabsTrigger>
            <TabsTrigger className="rounded-xl py-3 text-sm" value="help">
              Help desk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue">
            <Card className="border-white/80 bg-white/95 shadow-xl shadow-slate-900/10">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="size-6 text-teal-700" />
                  Municipal staff queue
                </CardTitle>
                <CardDescription>
                  Staff can review incoming reports and move each ticket through
                  the service workflow.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6">
                {recentComplaints.map((complaint) => (
                  <article
                    key={complaint.id}
                    className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto]"
                  >
                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={statusClass(complaint.status)}
                        >
                          {complaint.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={priorityClass(complaint.priority)}
                        >
                          {complaint.priority}
                        </Badge>
                        <span className="text-sm font-semibold text-slate-500">
                          {complaint.id}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-950">
                          {complaint.title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {complaint.description}
                        </p>
                      </div>
                      <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-3">
                        <span className="flex items-center gap-2">
                          <Building2
                            className="size-4 text-teal-700"
                            aria-hidden="true"
                          />
                          {complaint.department}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin
                            className="size-4 text-teal-700"
                            aria-hidden="true"
                          />
                          {complaint.ward}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock3
                            className="size-4 text-teal-700"
                            aria-hidden="true"
                          />
                          Due {formatDate(complaint.dueDate)}
                        </span>
                      </div>
                      <Progress
                        className="bg-slate-100 [&_[data-slot=progress-indicator]]:bg-teal-600"
                        value={statusProgress[complaint.status]}
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-3 rounded-2xl bg-slate-50 p-4 lg:min-w-52">
                      <div className="text-sm text-slate-600">
                        <p className="font-semibold text-slate-950">
                          {complaint.citizenName}
                        </p>
                        <p>{complaint.phone}</p>
                        <p>{complaint.address}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl border-teal-200 text-teal-800 hover:bg-teal-50"
                        disabled={complaint.status === "Resolved"}
                        onClick={() => moveStatus(complaint.id)}
                      >
                        {complaint.status === "Resolved"
                          ? "Closed"
                          : `Move to ${
                              statusOrder[
                                statusOrder.indexOf(complaint.status) + 1
                              ]
                            }`}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </article>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => {
                const Icon = category.Icon;
                return (
                  <Card
                    key={category.value}
                    className="border-white/80 bg-white/95 shadow-lg shadow-slate-900/5"
                  >
                    <CardHeader>
                      <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-lg">{category.label}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-600">
                      <p className="font-semibold text-slate-950">
                        {category.department}
                      </p>
                      <p className="mt-1">
                        Target response: {category.slaDays} day
                        {category.slaDays === 1 ? "" : "s"}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </section>
          </TabsContent>

          <TabsContent value="help">
            <section className="grid gap-6 lg:grid-cols-3">
              <Card className="border-white/80 bg-white/95 shadow-xl shadow-slate-900/10 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="size-6 text-teal-700" />
                    What citizens should include
                  </CardTitle>
                  <CardDescription>
                    Clear reports help the municipality route issues faster.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      title: "Exact location",
                      text: "Add ward, road, landmark, and the nearest public place.",
                      Icon: MapPin,
                    },
                    {
                      title: "Problem details",
                      text: "Mention when it started and how it affects people nearby.",
                      Icon: AlertCircle,
                    },
                    {
                      title: "Contact details",
                      text: "Use a reachable mobile number so staff can verify the site.",
                      Icon: Phone,
                    },
                  ].map((item) => {
                    const Icon = item.Icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <Icon
                          className="size-6 text-teal-700"
                          aria-hidden="true"
                        />
                        <h2 className="mt-4 font-bold text-slate-950">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.text}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-teal-200 bg-teal-800 text-white shadow-xl shadow-teal-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BadgeCheck className="size-6 text-teal-100" />
                    Citizen support
                  </CardTitle>
                  <CardDescription className="text-teal-50">
                    Municipality control room and ward help desk contacts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                  <div className="rounded-2xl bg-white/15 p-4">
                    <p className="text-teal-100">Helpline</p>
                    <p className="mt-1 text-xl font-bold">1800-000-000</p>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-4">
                    <p className="text-teal-100">Email</p>
                    <p className="mt-1 font-semibold">
                      helpdesk@municipality.gov
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-white/15 p-4">
                    <Sparkles
                      className="mt-0.5 size-5 text-teal-100"
                      aria-hidden="true"
                    />
                    <p>
                      Replace the sample contacts and wards with your city’s
                      official departments when you connect this to a real
                      municipality.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function TicketCard({ complaint }: { complaint: Complaint }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{complaint.id}</p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">
            {complaint.title}
          </h2>
        </div>
        <Badge variant="outline" className={statusClass(complaint.status)}>
          {complaint.status}
        </Badge>
      </div>
      <Progress
        className="mt-4 bg-slate-100 [&_[data-slot=progress-indicator]]:bg-teal-600"
        value={statusProgress[complaint.status]}
      />
      <div className="mt-4 grid gap-3 text-sm text-slate-600">
        <p className="flex items-start gap-2">
          <Building2 className="mt-0.5 size-4 text-teal-700" aria-hidden="true" />
          <span>
            <strong className="text-slate-950">Department:</strong>{" "}
            {complaint.department}
          </span>
        </p>
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 text-teal-700" aria-hidden="true" />
          <span>
            <strong className="text-slate-950">Location:</strong>{" "}
            {complaint.address}, {complaint.ward}
          </span>
        </p>
        <p className="flex items-start gap-2">
          <Clock3 className="mt-0.5 size-4 text-teal-700" aria-hidden="true" />
          <span>
            <strong className="text-slate-950">Expected response:</strong>{" "}
            {formatDate(complaint.dueDate)}
          </span>
        </p>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-950">Latest updates</p>
        <ol className="mt-3 grid gap-2 text-sm text-slate-600">
          {complaint.updates.map((update, index) => (
            <li key={`${complaint.id}-${index}`} className="flex gap-2">
              {index === complaint.updates.length - 1 ? (
                <CheckCircle2
                  className="mt-0.5 size-4 text-teal-700"
                  aria-hidden="true"
                />
              ) : (
                <span className="mt-2 size-2 rounded-full bg-slate-300" />
              )}
              <span>{update}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
