import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";
import { demoData, DEMO_DATE } from "@/lib/demo-data";
export const metadata: Metadata = { title: "Sample workspace" };
export default function DemoPage() { return <Dashboard data={demoData} demo anchor={DEMO_DATE}/>; }
