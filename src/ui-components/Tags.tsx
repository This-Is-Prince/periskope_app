"use client";

interface Props {
  tag: string;
}

export default function TagBadge({ tag }: Props) {
  const colorStyles: Record<string, string> = {
    demo: "bg-[#fcebe4] text-[#bb4a22]",
    internal: "bg-[#e8f9f0] text-[#2aaa5e]",
    signup: "bg-[#e6f4ff] text-[#3b82f6]",
    content: "bg-[#f3e8ff] text-[#9333ea]",
    "dont send": "bg-[#fee2e2] text-[#dc2626]",
    default: "bg-gray-200 text-gray-600",
  };

  const tagKey = tag.toLowerCase();
  const style = colorStyles[tagKey] || colorStyles.default;

  return (
    <span
      className={`px-1.5 py-[1px] text-[9px] rounded font-semibold capitalize ${style}`}
    >
      {tag}
    </span>
  );
}
