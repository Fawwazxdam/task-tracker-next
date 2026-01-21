"use client";

export default function DebugPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-8 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Debug Page
        </h1>
        <p className="text-gray-700 mb-4">
          This is a simple debug page with light mode only.
        </p>
      </div>
    </div>
  );
}