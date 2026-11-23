"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Dumbbell } from "lucide-react";
import AddExerciseForm from "./add-exercise-form";
import { deleteExercise } from "@/lib/services/plans";
import PlanDetailSkeleton from "@/components/shared/plan-detail-skeleton";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("Monday");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchData = async () => {
    const res = await fetch(`/api/plans/detail?id=${params.id}`);
    if (res.ok) {
      const result = await res.json();
      setData(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleDelete = async (exerciseId) => {
    if (!confirm("Delete this exercise?")) return;
    await deleteExercise(exerciseId);
    fetchData(); // Refresh
  };

  if (loading) return <PlanDetailSkeleton />;
  if (!data) return <div className="p-4 text-crimson">Plan not found.</div>;

  const { template, exercises } = data;
  const dayExercises = exercises.filter((e) => e.day_of_week === activeDay);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/plans" className="p-2 -ml-2 hover:bg-slate rounded-[10px] transition-colors">
          <ArrowLeft size={24} className="text-ink" />
        </Link>
        <div className="flex-1">
          <p className="eyebrow mb-1">{template.level}</p>
          <h1 className="disp text-3xl md:text-4xl text-ink">{template.name}</h1>
        </div>
        <Link
          href={`/plans/${params.id}/assign`}
          className="h-10 px-4 bg-crimson hover:bg-crimson-hover text-white font-bold text-sm rounded-[10px] transition-colors flex items-center gap-2"
        >
          Assign to Member
        </Link>
      </div>

      {template.description && (
        <p className="text-sm text-ink-muted">{template.description}</p>
      )}

      {/* Days Tabs */}
       <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {DAYS.map((day) => {
          const count = exercises.filter((e) => e.day_of_week === day).length;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-2 py-2 text-xs md:text-sm font-semibold rounded-[10px] transition-colors flex flex-col md:flex-row items-center justify-center gap-1 ${
                activeDay === day
                  ? "bg-crimson text-white"
                  : "bg-slate text-ink-muted hover:bg-line"
              }`}
            >
              <span>{day.slice(0, 3)}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeDay === day ? "bg-white/20" : "bg-black/40"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Exercises List */}
      <div className="bg-slate rounded-tile p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="disp text-xl text-ink">{activeDay.toUpperCase()}</h2>
          <button
            onClick={() => setIsAddOpen(true)}
            className="h-9 px-3 bg-black border border-line-strong hover:bg-line text-ink font-semibold text-sm rounded-[10px] flex items-center gap-1 transition-colors"
          >
            <Plus size={16} />
            Add Exercise
          </button>
        </div>

        {dayExercises.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell size={40} className="text-ink-faint mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-ink-muted">Rest day or no exercises added.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dayExercises.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center gap-3 p-3 bg-black/40 rounded-[10px] group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink">{ex.exercise_name}</p>
                  <p className="text-xs text-ink-muted num mt-0.5">
                    {ex.sets} sets × {ex.reps > 0 ? `${ex.reps} reps` : "—"}
                    {ex.duration && ` · ${ex.duration}`}
                  </p>
                  {ex.notes && (
                    <p className="text-xs text-ink-muted mt-1 italic">{ex.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(ex.id)}
                  className="p-2 text-ink-faint hover:text-crimson transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Exercise Modal */}
      {isAddOpen && (
        <AddExerciseForm
          templateId={params.id}
          dayOfWeek={activeDay}
          onClose={() => setIsAddOpen(false)}
          onSuccess={() => {
            setIsAddOpen(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}