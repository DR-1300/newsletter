import { Suspense } from "react";
import { getSubscribers } from "@/lib/api";
import type { Subscriber } from "@/lib/types";

export default function SubscribersPage() {
  return (
    <>
      <h1 className="font-display text-5xl">Subscribers</h1>
      <Suspense fallback={<p className="mt-8 text-xs text-muted">Loading…</p>}>
        <SubscriberTable />
      </Suspense>
    </>
  );
}

async function SubscriberTable() {
  let subscribers: Subscriber[];
  try {
    subscribers = await getSubscribers();
  } catch {
    return (
      <p className="mt-8 text-xs text-alert">
        Could not reach the API. Is the backend running?
      </p>
    );
  }

  if (subscribers.length === 0) {
    return <p className="mt-8 text-xs text-muted">No subscribers yet.</p>;
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[28rem] text-left text-xs">
        <thead className="text-[10px] uppercase tracking-widest text-muted">
          <tr>
            <th className="pb-3 font-normal">Email</th>
            <th className="pb-3 font-normal">Subscribed</th>
            <th className="pb-3 font-normal">Verified</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s.id} className="border-t border-muted/20">
              <td className="py-3 pr-4">{s.email}</td>
              <td className="py-3 pr-4 text-muted">
                {new Date(s.subscribed_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="py-3 text-muted">{s.is_verified ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}