"use client";

export function PrintButton() {
  return <button onClick={() => window.print()} className="btn-dark">Download / print</button>;
}
