"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { addExercise } from "@/lib/services/plans";

const EXERCISES = {
  Chest: ["Bench Press", "Push-ups", "Incline Dumbbell Press", "Cable Fly", "Dumbbell Fly"],
  Back: ["Pull-ups", "Lat Pulldown", "Barbell Row", "Deadlift", "Seated Row"],
  Legs: ["Squats", "Leg Press", "Lunges", "Calf Raises", "Leg Curl"],
  Shoulders: ["Overhead Press", "Lateral Raises", "Front Raises", "Shrugs", "Rear Delt Fly"],
  Arms: ["Bicep Curls", "Tricep Dips", "Hammer Curls", "Skull Crushers", "Preacher Curls"],
  Core: ["Plank", "Crunches", "Russian Twists", "Leg Raises", "Cable Crunches"],
  Cardio: ["Treadmill", "Cycling", "Jump Rope", "Rowing Machine", "Elliptical"],
};

export default function AddExerciseForm({ templateId, dayOfWeek, onClose, onSuccess }) {
  const [exerciseName, setExerciseName] = useState("Bench Press");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await addExercise({
        templateId,
        dayOfWeek,
        exerciseName,
        sets: Number(sets),
        reps: Number(reps),
        duration,
        notes,
      });
      if (result.success) onSuccess();
      else alert(result.error);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65">
      <div className="w-full max-w-[500px] bg-slate rounded-tile p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="disp text-2xl text-ink uppercase">Add Exercise</h2>
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-ink-muted mb-4">For {dayOfWeek}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">Exercise *</label>
            <select
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink focus:outline-none focus:border-crimson"
            >
              {Object.entries(EXERCISES).map(([category, list]) => (
                <optgroup key={category} label={category}>
                  {list.map((ex) => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">Sets *</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                min="1"
                required
                className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink focus:outline-none focus:border-crimson"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-2">Reps</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                min="0"
                className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink focus:outline-none focus:border-crimson"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">Duration (optional)</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 30 mins, 45 secs"
              className="w-full h-12 px-4 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-muted mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Form tips..."
              className="w-full p-3 bg-black border border-line-strong rounded-[10px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-crimson resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-line-strong rounded-[10px] text-ink font-semibold text-sm hover:bg-line"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 h-11 bg-crimson hover:bg-crimson-hover text-white font-bold text-sm rounded-[10px] disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}