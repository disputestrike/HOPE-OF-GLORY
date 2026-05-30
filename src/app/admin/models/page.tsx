const modelRoutes = [
  {
    name: "Ask Hope",
    route: "Scripture-first answer, safety classifier, retrieval, answer model, related links.",
  },
  {
    name: "Sermon pipeline",
    route: "Calendar selection, sermon draft, citation check, doctrine check, editorial state.",
  },
  {
    name: "Image and video",
    route: "Sermon brief, visual prompt, brand safety review, media queue.",
  },
  {
    name: "Phone ministry",
    route: "SignalWire inbound, Deepgram transcription, safety triage, Ask Hope response, handoff.",
  },
  {
    name: "Publishing",
    route: "Postiz scheduling, platform captions, URL tracking, failure retry.",
  },
];

export default function AdminModelsPage() {
  return (
    <div className="p-10 max-w-6xl">
      <header className="mb-10">
        <p className="eyebrow">Models</p>
        <h1 className="m-0">AI routing map</h1>
        <p className="text-muted m-0 mt-3">
          This view explains which model path handles each ministry surface. Credentials
          activate live calls; preview mode uses the built-in launch content and safe fallbacks.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modelRoutes.map((item) => (
          <article key={item.name} className="card">
            <p className="card__eyebrow">{item.name}</p>
            <p className="m-0 text-muted">{item.route}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

